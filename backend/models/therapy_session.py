from . import db
from datetime import datetime, timezone
from sqlalchemy import ForeignKey


class TherapySession(db.Model):
    __tablename__ = 'therapy_session'

    id = db.Column(db.Integer, primary_key=True)
    session_name = db.Column(db.String(80), nullable=True)

    email = db.Column(db.String(80), ForeignKey("user.email"), nullable=False)
    username = db.Column(db.String(80), ForeignKey(
        "user.username"), nullable=False)

    timestamp = db.Column(db.DateTime, nullable=False,
                          default=datetime.now(timezone.utc))
