import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS

from models import db, User, Organization, FAQ, Ticket

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

OpenAI.api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OpenAI.api_key)

db.init_app(app)
migrate = Migrate(app, db)
# CORS(app, resources={r"/chat": {"origins": "*"}, r"/signup": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


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
        _password=['password'],
        email=data['email']
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user.to_dict(), 201

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('input')

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {
            "role": "system",
            "content": [
                {
                "type": "text",
                "text": "Your name is Norman and you are a helpful assistant for a Customer Service AI Chatbot."
                }
            ]
            },
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": user_input
                }
            ]
            }
        ],
        temperature=1,
        max_tokens=1000,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
        )
    print("Response:", response)
    bot_message_text = response.choices[0].message.content.strip()
    return jsonify({'response': bot_message_text}), 200

@app.route('/profile/<int:id>', methods=['GET', 'PATCH'])
def profile(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return {'error': 'User not found'}, 404
    
    if request.method == 'GET':
        profile_data = user.to_dict()
        return jsonify(profile_data), 200
    
    elif request.method == 'PATCH':
        try:
            data = request.get_json()
            for key, value in data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            db.session.commit()
            return jsonify(user.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
        
if __name__ == '__main__':
    app.run(port=5555, debug=True)
