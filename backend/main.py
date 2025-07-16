from config import app, db
from utils.token_utils import Token

from services.auth import AuthService
from services.text_generator import TextGenerator
from services.ai_therapist import AITherapistService

from core.voice.voice_generator import VoiceGenerator

from core.voice.strategies.samantha_voice import SamanthaVoiceStrategy

from routes import auth, message

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        app.text_generator = TextGenerator()
        app.voice_generator = VoiceGenerator(SamanthaVoiceStrategy())
        app.ai_therapist = AITherapistService()
        app.auth_service = AuthService(db.session)
        app.token_handler = Token(app.config["SECRET_KEY"])

    # TODO: Remove the debug=True when finish the project
    app.run(debug=True)
