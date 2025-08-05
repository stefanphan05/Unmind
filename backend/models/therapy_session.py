from . import db
from datetime import datetime, timezone
from sqlalchemy import ForeignKey


class TherapySession(db.Model):
    __tablename__ = "therapy_session"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    result = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, nullable=False,
                     default=datetime.now(timezone.utc))

    email = db.Column(db.String(80), ForeignKey("user.email"), nullable=False)
