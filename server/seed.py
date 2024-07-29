from app import app, db
from models import Role, Organization, User, Ticket, bcrypt
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

        user_demo = User(
            firstname="Sandro",
            lastname="Ledesma",
            username="sandro",
            password=bcrypt.generate_password_hash("123").decode('utf-8'),
            email="sandro@norman.com",
            organization_id="LG Electronics",
            role_id="Product"
        )
        db.session.add(user_demo)
        db.session.commit()

        for _ in range(14):
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

        ticket_demo = [
            Ticket(
                timestamp=fake.date_time_this_month(),
                description="Hello! My washing machines spin cycle is not working as well as it should be - the clothes are soaking wet \
                    - although I do understand that it is in the washer, I feel like something is wrong with the RPM of the spin cycle.",
                status=str(choice(status)),
                tag="Engineering",
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to="1"
            ),
            Ticket(
                timestamp=fake.date_time_this_month(),
                description="There seems to be some cycles that should work with AI connectivity. I have my Washer hooked up to the Wifi \
                    however it does not seem like the AI cycles are working. Its not allowing me to change water temperature depending on \
                        the load size, shape, color and weight.",
                status=str(choice(status)),
                tag="Product",
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to="1"
            ),
            Ticket(
                timestamp=fake.date_time_this_month(),
                description="I am entering this request for my mother, who has glaucoma. We need a Braille overlay in the physical control \
                    panel of the Washer and Dryer, is this something that can be provided?",
                status=str(choice(status)),
                tag="Design",
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to="2"
            ),
            Ticket(
                timestamp=fake.date_time_this_month(),
                description="I think the heating element of the dryer stopped working... It was fine for the last 10 cycles I have done \
                    however now it seems like its always cold inside the dryer and the clothes remain wet, as if it was right out of the washer.",
                status=str(choice(status)),
                tag="Quality",
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to="2"
            ),
            Ticket(
                timestamp=fake.date_time_this_month(),
                description="After one use of the washer, it started leaking. We literally just got this delivered and installed yesterday \
                    and its already not working.. how is that possible? Could it be an issue of unreliable installation?",
                status=str(choice(status)),
                tag="Service",
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to="3"
            )            
        ]
        db.session.add_all(ticket_demo)
        db.session.commit()

        for _ in range(30):
            ticket = Ticket(
                timestamp=fake.date_time_this_month(),
                description=fake.text(),
                status=str(choice(status)),
                tag=str(choice(roles)),
                consumer_name=fake.name(),
                consumer_email=fake.email(),
                assigned_to=str([randint(1, 15)])
            )
            db.session.add(ticket)
            db.session.commit()

if __name__ == "__main__":
    seed()
    print("Database seeded!")