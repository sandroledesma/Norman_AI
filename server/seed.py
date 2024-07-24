from app import app, db
from models import Role, Organization, User
from faker import Faker
import random
from random import random, choice

fake = Faker()

def seed():
    organizations = ['Lifetime Brands', 'Manfrotto Distribution', 'LG Electronics']
    roles = ['Engineering', 'Product', 'Design', 'Quality', 'Service']
    
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

if __name__ == "__main__":
    seed()
    print("Database seeded!")