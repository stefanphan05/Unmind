from . import db
from enum import Enum
from sqlalchemy import ForeignKey


class InputType(Enum):
    SPEECH = 'SPEECH'
    TEXT = 'TEXT'


class Conversation(db.Model):
    __tablename__ = 'conversation'

    id = db.Column(db.Integer, primary_key=True)

    # Foreign key from therapy_session model
    session_id = db.Column(db.Integer, ForeignKey(
        "therapy_session.id"), nullable=False)

    # Large text inputs/outputs
    user_input = db.Column(db.Text, nullable=False)
    ai_response = db.Column(db.Text, nullable=False)

    # Using enum for a limited set of choices
    input_type = db.Column(db.Enum(InputType), nullable=False)
