from . import db
from enum import Enum
from sqlalchemy import ForeignKey
from datetime import datetime, timezone


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

    therapy_session_id = db.Column(
        db.Integer, ForeignKey("therapy_session.id"), nullable=False)

    timestamp = db.Column(db.DateTime, nullable=False,
                          default=datetime.now(timezone.utc))
