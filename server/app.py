import os
import json
from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS

from models import User, Ticket

app = Flask(__name__)

@app.route('/', methods=["GET"])
def homepage():
    return {'message': 'Welcome to Norman!'}, 200

@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter(User.username == data['username']).first()
    if not user: 
        return {'error': 'login failed'}, 401
    if not user.authenticate(data['password']):
        return {'error': 'login failed'}, 401
    
    session['user_id'] = user.id

    return user.to_dict(), 200

@app.route('/logout', methods=["DELETE"])
def logout(): 
    session.pop('user_id', None)
    return {}, 204

if __name__ == '__main__':
    app.run(port=5555, debug=True)