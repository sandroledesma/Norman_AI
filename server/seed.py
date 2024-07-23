from app import app
from models import Role, Organization, User, db
from faker import Faker
import random

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

        # Create users
        for _ in range(10):
            user = User(
                firstname=fake.first_name(),
                lastname=fake.last_name(),
                username=fake.user_name(),
                password='password',
                email=fake.email(),
                organization_id=random.choice(Organization.query.all()).id,
                role_id=random.choice(Role.query.all()).id
            )
            db.session.add(user)

        db.session.commit()

if __name__ == "__main__":
    seed()
    print("Database seeded!")
