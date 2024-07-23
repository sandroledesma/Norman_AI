from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, BLOB, Boolean, Nullable, MetaData
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt
from sqlalchemy_serializer import SerializerMixin

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String, nullable=False)
    lastname = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    _password = db.Column(BLOB, nullable=False)
    credentials = db.Column(BLOB, nullable=True, default='')
    email = db.Column(db.String, nullable=False)
    # organization = db.Column(db.String, db.ForeignKey('organization.id'), nullable=False)
    # role = db.Column(db.String, db.ForeignKey('organization.role'), nullable=False)

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
        hash = bcrypt.generate_password_hash(new_password.encode('utf-8'))
        self._password = hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password, password.encode('utf-8'))

    def __repr__(self) -> str:
        return f"<User {self.username}>"
    
# class ChatMessage(db.Model):
#     __tablename__ = 'chat_messages'

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     message = db.Column(db.String, nullable=False)
#     sender = db.Column(db.String, nullable=False)
#     timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

#     user = db.relationship('User', back_populates='messages')

# User.messages = db.relationship('ChatMessage', order_by=ChatMessage.id, back_populates='user')

class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    organization = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)

    def __repr__(self) -> str:
        return f"<Organization {self.organization}>"

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

class Ticket(db.Model): 
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default='open')
    response = db.Column(db.String, nullable=False)
    tag = db.Column(db.String, nullable=False)

    # user = db.relationship('User', back_populates='ticket')

    def __repr__(self) -> str:
        return f"<Ticket {self.id}, {self.status}>"