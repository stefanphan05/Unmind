from . import db


class VoicePersona(db.Model):
    __tablename__ = 'voice_persona'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    character_name = db.Column(db.String(100))
    voice_model_path = db.Column(db.String(255), nullable=False)
