from config import app, db
from utils.token_utils import Token

from services.authentication.auth import AuthService
from services.text.text_generator import TextGenerator
from services.ai.ai_therapist import AITherapistService
from services.voice.voice_generator import VoiceGenerator
from services.voice.strategies.samantha_voice import SamanthaVoiceStrategy
from services.audio.audio_service import AudioProcessingService

from routes import auth, message

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        app.text_generator = TextGenerator()
        app.voice_generator = VoiceGenerator(SamanthaVoiceStrategy())
        app.audio_service = AudioProcessingService()
        app.ai_therapist = AITherapistService(db.session)
        app.auth_service = AuthService(db.session)
        app.token_handler = Token(app.config["SECRET_KEY"])

    # TODO: Remove the debug=True when finish the project
    app.run(debug=True)
