from . import db


class User(db.Model):
    __tablename__ = 'user'

    email = db.Column(db.String(80), primary_key=True, nullable=False)
    username = db.Column(db.String(80), nullable=True)
    password = db.Column(db.String(128), nullable=False)
