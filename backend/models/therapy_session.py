from config import db
from datetime import datetime, timezone
from sqlalchemy import ForeignKey


class TherapySession(db.Model):
    __tablename__ = "therapy_session"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, default="")
    status = db.Column(db.String(20), nullable=False, default="ongoing")
    result = db.Column(db.String(20), nullable=False, default="pending")
    date = db.Column(db.DateTime, nullable=False,
                     default=datetime.now(timezone.utc))

    email = db.Column(db.String(80), ForeignKey("user.email"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "result": self.result,
            "date": self.date,
            "email": self.email
        }
