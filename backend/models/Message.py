from . import db
from enum import Enum


class InputType(Enum):
    SPEECH = 'SPEECH'
    TEXT = 'TEXT'


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)

    # Large text inputs/outputs
    user_input = db.Column(db.Text, nullable=False)
    ai_response = db.Column(db.Text, nullable=False)

    # Using enum for a limited set of choices
    input_type = db.Column(db.Enum(InputType), nullable=False)
