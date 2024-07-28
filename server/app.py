import os
from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime

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
#       - and create a Customer Service ticket that includes their name, email and description of issue. After the chat is complete, you need to \
#       assign the ticket to a user_id based on their role_id. You will also assign a status of 'Assigned' to that ticket with the timestamp of \
#       when the ticket was created.",
#     model="gpt-3.5-turbo-16k",
#     tools=[{"type": "function"}]
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

    if 'chat_session' not in session:
        session['chat_session'] = {}

    chat_session = session['chat_session']

    # thread = client.beta.threads.create()
    # message = client.beta.threads.messages.create(
    #     thread_id=thread.id,
    #     role="user",
    #     content="I have a problem with one of the products I have - I need your help to resolve the issue."
    # )

    # run = client.beta.threads.runs.create_and_poll(
    #     thread_id=thread.id,
    #     assistant_id=assistant.id
    # )

    # if run.status == 'completed':
    #     messages = client.beta.threads.messages.list(
    #         thread_id=thread.id
    #     )
    #     print(messages)
    # else:
    #     print(run.status)

    print("Current chat session:", chat_session)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", 
            "content": "You are Norman, a Customer Service AI Chatbot. Assist users in creating Customer Service \
            Tickets by asking for their name, email, and issue description. Handle one step at a time and confirm \
            each piece of information before moving to the next. Avoid long responses to keep users \
            from feeling overwhelmed."},
            {"role": "user", "content": user_input}
        ],
        temperature=1,
        max_tokens=1000
    )

    bot_message_text = response.choices[0].message.content.strip()

    if "consumer_name" not in chat_session:
        chat_session["consumer_name"] = user_input
        bot_message_text = "Thank you! Could you please provide your email address?"

    elif "consumer_email" not in chat_session:
        chat_session["consumer_email"] = user_input
        bot_message_text = "Got it! Could you please describe the issue you're experiencing, including any relevant details like model number, serial number, etc.?"

    elif "issue_description" not in chat_session:
        chat_session["issue_description"] = user_input
        role_id = 1
        assigned_user = User.query.filter_by(role_id=role_id).first()

        new_ticket = Ticket(
            timestamp=datetime.now(),
            description=chat_session["issue_description"],
            tag="Customer Issue",
            status="Assigned",
            consumer_name=chat_session["consumer_name"],
            consumer_email=chat_session["consumer_email"],
            assigned_to=assigned_user.id if assigned_user else None,
            role_id=role_id
        )
        db.session.add(new_ticket)
        db.session.commit()

        bot_message_text = f"Thank you, {chat_session['consumer_name']}! Your issue has been logged. A customer service representative will contact you soon."

        session.pop('chat_session', None)

    else:
        bot_message_text = "An error occurred. Please start the process again."

    session['chat_session'] = chat_session

    return jsonify({'response': bot_message_text, 'session': chat_session}), 200
   
@app.route('/profile/<int:id>', methods=['GET'])
def get_profile(id):
    user = User.query.filter_by(id=id).first()
    if not user:
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
        for key, value in data.items():
            setattr(user, key, value)

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

@app.route('/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all() 
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

@app.route('/tickets/<int:id>', methods=['GET'])
def ticket_by_id(id):
    ticket = Ticket.query.filter(Ticket.id == id).first()
    return ticket.to_dict(), 200

@app.route('/tickets/<int:user_id>', methods=['GET'])
def get_user_tickets(user_id):
    tickets = Ticket.query.filter_by(assigned_to=user_id).all()
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)

