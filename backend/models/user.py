from . import db


class User(db.Model):
    __tablename__ = 'user'

    username = db.Column(db.String(80), primary_key=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    preferred_voice = db.Column(db.String(50), default="Samantha")

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "preferred_voice": self.preferred_voice
        }
