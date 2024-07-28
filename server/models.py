from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String, nullable=False)
    lastname = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    _password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=True)
    
    organization = db.relationship('Organization', back_populates='users')
    role = db.relationship('Role', back_populates='users')

    tickets = db.relationship('Ticket', back_populates='users')

    @validates('username')
    def validate_username(self, key, value):
        if not value:
            raise ValueError("Username is required")
        if len(value) < 3 or len(value) > 50:
            raise ValueError("Username must be between 3 and 50 characters")
        return value
    
    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, new_password):
        hash = bcrypt.generate_password_hash(new_password.encode('utf-8')).decode('utf-8')
        self._password = hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password, password.encode('utf-8'))

    serialize_rules = ['-organization.users', '-role.users', '-_password', '-tickets.users']

    def __repr__(self) -> str:
        return f"<User {self.username}>"

class Organization(db.Model, SerializerMixin):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    users = db.relationship('User', back_populates='organization', lazy=True)

    serialize_rules = ['-users.organization']

    def __repr__(self) -> str:
        return f"<Organization {self.name}>"

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    users = db.relationship('User', back_populates='role')
    
    serialize_rules = ['-users.role']

    def __repr__(self) -> str:
        return f"<Role {self.name}>"
    
class FAQ(db.Model):
    __tablename__ = 'faqs'

    id = db.Column(db.Integer, primary_key=True)
    organization = db.Column(db.String, nullable=False)
    tag = db.Column(db.String, nullable=False)
    question = db.Column(db.String, nullable=False)
    answer = db.Column(db.String, nullable=False)

    @validates('question')
    def validate_not_empty(self, key, value):
        if not value: 
            raise ValueError(f"Question cannot be empty")
        return value

    @validates('answer')
    def validate_not_empty(self, key, value):
        if not value: 
            raise ValueError(f"Answer cannot be empty")
        return value

    def __repr__(self) -> str: 
        return f"<FAQ {self.organization}, {self.tag}, {self.question}, {self.answer}>"

class Ticket(db.Model, SerializerMixin): 
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String, nullable=False)
    tag = db.Column(db.String, nullable=True)
    status = db.Column(db.String, nullable=True, default='open')
    consumer_name = db.Column(db.String, nullable=False)
    consumer_email = db.Column(db.String, nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    # role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=True)

    users = db.relationship('User', back_populates='tickets')
   
    serialize_rules = ['-users.tickets']

    def __repr__(self) -> str:
        return f"<Ticket {self.id}, {self.status}>"
