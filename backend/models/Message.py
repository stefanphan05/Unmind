from . import db
from sqlalchemy import ForeignKey
from datetime import datetime, timezone


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    ai_response = db.Column(db.Text, nullable=False)

    therapy_session_id = db.Column(db.Integer, ForeignKey(
        "therapy_session.id"), nullable=False)

    email = db.Column(db.String(80), ForeignKey(
        "user.email"), nullable=False)

    timestamp = db.Column(db.DateTime, nullable=False,
                          default=datetime.now(timezone.utc))
