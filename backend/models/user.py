from . import db
from .voice import VoiceEnum


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    prefered_voice = db.Column(
        db.Enum(VoiceEnum), nullable=False, default=VoiceEnum.default)
