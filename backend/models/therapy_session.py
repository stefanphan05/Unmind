from . import db
from enum import Enum
from sqlalchemy import ForeignKey


class StatusType(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'


class TherapySession(db.Model):
    __tablename__ = 'therapy_session'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("user.id"), nullable=False)
    voice_persona_id = db.Column(db.Integer, ForeignKey(
        "voice_persona.id"), nullable=False)
    session_name = db.Column(db.String(80))
    status = db.Column(db.Enum(StatusType), nullable=False,
                       default=StatusType.ACTIVE)
