from . import db
from enum import Enum
from sqlalchemy import ForeignKey


class StatusType(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'


class TherapySession(db.Model):
    __tablename__ = 'therapy_session'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), ForeignKey(
        "user.username"), nullable=False)

    status = db.Column(db.Enum(StatusType), nullable=False,
                       default=StatusType.ACTIVE)
