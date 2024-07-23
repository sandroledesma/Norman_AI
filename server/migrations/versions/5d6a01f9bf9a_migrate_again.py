"""migrate again

Revision ID: 5d6a01f9bf9a
Revises: 
Create Date: 2024-07-23 16:16:24.903380

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5d6a01f9bf9a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('faqs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('organization', sa.String(), nullable=False),
    sa.Column('tag', sa.String(), nullable=False),
    sa.Column('question', sa.String(), nullable=False),
    sa.Column('answer', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_faqs'))
    )
    op.create_table('organizations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('organization', sa.String(), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_organizations'))
    )
    op.create_table('tickets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('response', sa.String(), nullable=False),
    sa.Column('tag', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_tickets'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('firstname', sa.String(), nullable=False),
    sa.Column('lastname', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('_password', sa.BLOB(), nullable=False),
    sa.Column('credentials', sa.BLOB(), nullable=True),
    sa.Column('email', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('username', name=op.f('uq_users_username'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    op.drop_table('tickets')
    op.drop_table('organizations')
    op.drop_table('faqs')
    # ### end Alembic commands ###