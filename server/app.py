import os
from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime
import logging

from models import db, User, Organization, Role, Ticket

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_secret_key')

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)

OpenAI.api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OpenAI.api_key)

# assistant = client.beta.assistants.create(
#     name="Customer Service AI-gent",
#     instructions="You are a customer service agent named Norman - your job is to understand the problem and issue happening from the consumer \
#       - and generate a response that the customer service rep will be able to use to go back to the consumer with next steps and action items.",
#     model="gpt-4o-mini",
#     tools=[
#         {
#             "type": "function",
#             "function": {
#                 "name": "add_tag",
#                 "description": "Add a tag to the customer service ticket so it gets assigned to the appropriate user",
#                 "parameters": {
#                     "type": "object",
#                     "properties": {
#                         "tags": {
#                             "type": "array",
#                             "items": {
#                                 "type": "string",
#                                 "enum": ["Engineering", "Product", "Design", "Quality", "Service"]
#                             },
#                             "description": "List of tags to be added to the ticket"
#                         }
#                     },
#                     "required": ["tags"]
#                 }
#             }
#         }
#     ]
# )

@app.route('/', methods=['GET'])
def homepage():
    return {'message': 'Norman, at your service!'}, 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter(User.username == data['username']).first()
    if not user: 
        return {'error': 'login failed'}, 401
    
    if not user.authenticate(data['password']):
        return {'error': 'login failed'}, 401
    
    session['user_id'] = user.id
    return user.to_dict(), 200

@app.route('/logout', methods=['DELETE'])
def logout(): 
    session.pop('user_id', None)
    return {}, 204

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user = User.query.filter(User.username == data['username']).first()
    if user:
        return {'error': 'username already exists'}, 400
    new_user = User(
        firstname=data.get('firstname'),
        lastname=data.get('lastname'),
        username=data.get('username'),
        password=data.get('password'),
        email=data.get('email'),
        organization_id=data.get('organization_id'),
        role_id=data.get('role_id')
    )
    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        app.logger.error(f"Error during signup: {str(e)}")
        return jsonify({'error': 'Database error'}), 500

@app.route('/organizations', methods=['GET'])
def get_organizations():
    organizations = Organization.query.all()
    org_list = [{'id': org.id, 'name': org.name} for org in organizations]
    return jsonify(org_list)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('input')

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", 
            "content": "You are Norman, a Customer Service AI Chatbot. Assist users in creating Customer Service \
            Tickets by asking for their name, email, and issue description. Avoid long responses to keep users from feeling overwhelmed. \
            After you have all the information needed (name, email and issue description), say thank you to the user and let \
            them know that the ticket was submitted and they should hear from someone soon. Finally, as a chatbot, you need to \
            update the tickets database with the new ticket that was just created."},
            {"role": "user", "content": user_input}
        ],
        temperature=1,
        max_tokens=1000
    )

    bot_message_text = response.choices[0].message.content.strip()
    return jsonify({'response': bot_message_text}), 200
   
@app.route('/profile/<int:id>', methods=['GET'])
def get_profile(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        app.logger.error(f"User with id {id} not found")
        return {'error': 'User not found'}, 404

    try:
        response = jsonify(user.to_dict())
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200

    except Exception as e:
        app.logger.error(f"Error during GET: {str(e)}")
        return {'error': str(e)}, 500
    
@app.route('/profile/<int:id>', methods=['PATCH'])
def update_profile(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return {'error': 'User not found'}, 404

    try:
        data = request.get_json()
        logging.info(f"Data received for update: {data}")

        allowed_fields = {'firstname', 'lastname', 'username', 'email'}
        for key, value in data.items():
            if key in allowed_fields:
                setattr(user, key, value)

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating profile: {e}")
        return {'error': str(e)}, 500
    
@app.route('/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all()
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

# @app.route('/tickets/<int:id>', methods=['GET'])
# def get_ticket(id):
#     ticket = Ticket.query.filter(Ticket.id == id).first()
#     if ticket:
#         ticket_data = {
#             'id': ticket.id,
#             'timestamp': ticket.timestamp,
#             'description': ticket.description,
#             'tag': ticket.tag,
#             'status': ticket.status,
#             'consumer_name': ticket.consumer_name,
#             'consumer_email': ticket.consumer_email,
#             'assigned_to': {
#                 'id': ticket.assigned_user.id,
#                 'firstname': ticket.assigned_user.firstname,
#                 'lastname': ticket.assigned_user.lastname
#             } if ticket.assigned_user else None
#         }
#         return jsonify(ticket_data), 200
#     return jsonify({'error': 'Ticket not found'}), 404

@app.route('/tickets/<int:id>', methods=['GET'])
def get_ticket(id):
    ticket = Ticket.query.filter(Ticket.id == id).first()
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404

    ai_response = generate_ai_response(ticket.description)
    
    ticket_data = ticket.to_dict()
    ticket_data['ai_response'] = ai_response
    
    return jsonify(ticket_data), 200

def generate_ai_response(description):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are Norman, a Customer Service AI Chatbot. Generate a response based on the ticket description. \
             Please make sure that your responses start with a Greeting, potential fixes to the solution, and a final conclusion. It should \
             be very easy to read for the user to send to the consumer."},
            {"role": "user", "content": description}
        ],
        temperature=1,
        max_tokens=1000
    )
    
    return response.choices[0].message.content.strip()

@app.route('/tickets/<int:id>', methods=['GET'])
def ticket_by_id(id):
    ticket = Ticket.query.filter(Ticket.id == id).first()
    if ticket:
        ticket_data = ticket.to_dict()
        if ticket.assigned_to:
            ticket_data['assigned_to_firstname'] = ticket.assigned_to.firstname
            ticket_data['assigned_to_lastname'] = ticket.assigned_to.lastname
        return ticket_data, 200
    else:
        return {'error': 'Ticket not found'}, 404
    
@app.route('/generate-response', methods=['POST'])
def generate_response():
    data = request.json
    description = data.get('description')
    
    if not description:
        return jsonify({'error': 'Description is required'}), 400

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are Norman, a Customer Service AI Chatbot. Generate a response based on the ticket description. \
             Please make sure that your responses start with a Greeting, potential fixes to the solution, and a final conclusion. It should \
             be very easy to read for the user to send to the consumer."},
            {"role": "user", "content": description}
        ],
        temperature=1,
        max_tokens=1000
    )

    bot_message_text = response.choices[0].message.content.strip()
    return jsonify({'response': bot_message_text}), 200

# @app.route('/generate-response', methods=['POST'])
# def generate_response():
#     data = request.json
#     description = data.get('description')
    
#     if not description:
#         return jsonify({'error': 'Description is required'}), 400

#     thread = client.beta.threads.create()

#     message = client.beta.threads.message.create([
#         {"role": "system", "content": "You are an AI assistant that helps assign customer service tickets to the appropriate \
#          role based on the issue described."},
#         {"role": "user", "content": "Based on the following product issue described by the consumer, assign the most appropriate \
#          role to handle the issue from the following options: Engineering, Product, Design, Quality, Service."},

#         # Engineering
#         {"role": "user", "content": "Product Issue: The device keeps restarting randomly after the latest firmware update. \
#          The role/tag is: Engineering"},
#         {"role": "assistant", "content": "Engineering"},
#         {"role": "user", "content": "Product Issue: The spin cycle is not at the max RPM for clothes to be as dry as possible for the dryer. \
#          The role/tag is: Engineering"},
#         {"role": "assistant", "content": "Engineering"},
        
#         # Product
#         {"role": "user", "content": "Product Issue: I think the app would be more user-friendly if it had a dark mode option. \
#          The role/tag is: Product"},
#         {"role": "assistant", "content": "Product"},
#         {"role": "user", "content": "Product Issue: App useability is not working while in a remote enviroment.\
#          The role/tag is: Product"},
#         {"role": "assistant", "content": "Product"},
#         {"role": "user", "content": "Product Issue: Cycles utilizing AI connectivity does not allow for the user to change the water temperature \
#          based on load size, shape, color and weight. The role/tag is: Product"},
#         {"role": "assistant", "content": "Product"},

#         #Design
#         {"role": "user", "content": "Product Issue: The icons on the app are too small and hard to tap accurately. \
#          The role/tag is: Design"},
#         {"role": "assistant", "content": "Design"},
#         {"role": "user", "content": "Product Issue: Braille overlay is needed for ADA compliance in the physical control panel of Washing Machine. \
#          The role/tag is: Design"},
#         {"role": "assistant", "content": "Design"},
        
#         #Quality
#         {"role": "user", "content": "Product Issue: The screen has a dead pixel and there are scratches on the back cover. \
#          The role/tag is: Quality"},
#         {"role": "assistant", "content": "Quality"},
#         {"role": "user", "content": "Product Issue: Heating element no longer working after 10 weeks of use. Everything is hooked up. \
#          The role/tag is: Quality"},
#         {"role": "assistant", "content": "Quality"},

#         #Service
#         {"role": "user", "content": "Product Issue: I have not received my parts order even though the estimated delivery date was last week. \
#          The role/tag is: Service"},
#         {"role": "assistant", "content": "Service"},
#         {"role": "user", "content": "Product Issue: My washer is leaking after the first wash - could be an issue of unreliable installation. \
#          The role/tag is: Service"},
#         {"role": "assistant", "content": "Service"},
#     ])

#     run = client.beta.threads.runs.create_and_poll(
#         thread_id=thread.id,
#         assistant_id=assistant.id,
#         instructions="Please help the customer service rep respond to the consumer based on the issue they are having."
#     )
    
#     if run.status == 'completed':
#         messages = client.beta.threads.messages.list(thread_id=thread.id)
#         ai_response = messages[-1]['content']
#         return jsonify({'response': ai_response}), 200
#     else:
#         return jsonify({'error': 'Failed to generate AI response', 'status': run.status}), 500

@app.route('/tickets/<int:user_id>', methods=['GET'])
def get_user_tickets(user_id):
    tickets = Ticket.query.filter_by(assigned_to=user_id).all()
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

@app.route('/tickets/<int:id>/status', methods=['PUT'])
def update_ticket_status(id):
    data = request.get_json()
    status = data.get('status')
    
    ticket = Ticket.query.get(id)
    if ticket:
        ticket.status = status
        db.session.commit()
        return jsonify(ticket.to_dict()), 200
    return jsonify({"error": "Ticket not found"}), 404

@app.route('/tickets/<int:id>/tag', methods=['PUT'])
def update_ticket_tag(id):
    data = request.get_json()
    tag = data.get('tag')
    
    ticket = Ticket.query.get(id)
    if ticket:
        ticket.tag = tag
        db.session.commit()
        return jsonify(ticket.to_dict()), 200
    return jsonify({"error": "Ticket not found"}), 404

if __name__ == '__main__':
    app.run(port=5555, debug=True)

