from config import db
from sqlalchemy import ForeignKey
from datetime import datetime, timezone


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False,
                          default=datetime.now(timezone.utc))

    email = db.Column(db.String(80), ForeignKey(
        "user.email"), nullable=False)
    therapy_session_id = db.Column(db.Integer, ForeignKey(
        "therapy_session.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "role": self.role,
            "timestamp": self.timestamp.isoformat(),
            "email": self.email,
            "therapy_session_id": self.therapy_session_id
        }
