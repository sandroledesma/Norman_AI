import os
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from extensions import db, bcrypt
from dotenv import load_dotenv
from openai import OpenAI

from models import User, Organization, Role

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

OpenAI.api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OpenAI.api_key)

CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)

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
        firstname=data['firstname'],
        lastname=data['lastname'],
        username=data['username'],
        password=data['password'],
        email=data['email'],
        organization_id=data.get('organization_id', None),
        role_id=data.get('role_id', None)
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user.to_dict(), 201

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
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": "Your name is Norman and you are a helpful assistant for a Customer Service AI Chatbot."},
            {"role": "user", "content": user_input}
        ],
        temperature=1,
        max_tokens=1000
    )
    print("Response:", response)
    bot_message_text = response.choices[0].message['content'].strip()
    return jsonify({'response': bot_message_text}), 200

@app.route('/profile/<int:id>', methods=['GET', 'PATCH'])
def profile(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return {'error': 'User not found'}, 404
    
    if request.method == 'GET':
        try:
            response = jsonify(user.to_dict())
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 200
        except Exception as e:
            app.logger.error(f"Error during GET: {str(e)}")
            return {'error': str(e)}, 500
    
    elif request.method == 'PATCH':
        try:
            data = request.get_json()
            for key, value in data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            db.session.commit()
            response = jsonify(user.to_dict())
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 200
        except Exception as e:
            app.logger.error(f"Error during PATCH: {str(e)}")
            db.session.rollback()
            return {'error': str(e)}, 500
        
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
