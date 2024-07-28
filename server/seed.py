from app import app, db
from models import Role, Organization, User, Ticket
from faker import Faker
import random
from random import random, choice, randint

fake = Faker()

def seed():
    organizations = ['Lifetime Brands', 'Manfrotto Distribution', 'LG Electronics']
    roles = ['Engineering', 'Product', 'Design', 'Quality', 'Service']
    status = ['Open', 'Pending', 'Assigned', 'In Process', 'Priority', 'Closed']
    
    with app.app_context():
        # Create organizations
        for org_name in organizations:
            org = Organization(name=org_name)
            db.session.add(org)
        
        # Create roles
        for role_name in roles:
            role = Role(name=role_name)
            db.session.add(role)
        
        db.session.commit()
        
        # Now create users with existing organizations and roles
        for _ in range(20):
            user = User(
                firstname=fake.first_name(),
                lastname=fake.last_name(),
                username=fake.user_name(),
                password='password',
                email=fake.email(),
                organization_id=choice([org.id for org in Organization.query.all()]),
                role_id=choice([role.id for role in Role.query.all()])
            )
            db.session.add(user)
            db.session.commit()

        for _ in range(60):
            ticket = Ticket(
                timestamp=fake.date_time_this_month(),
                description=fake.text(),
                status=str(choice(status)),
                tag=str(choice(roles)),
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to=str([randint(1, 20)])
            )
            db.session.add(ticket)
            db.session.commit()

if __name__ == "__main__":
    seed()
    print("Database seeded!")