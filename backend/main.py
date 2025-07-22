from config import app, db
from utils.token_utils import Token

from services.authentication.auth import AuthService
from services.text.text_generator import TextGenerator
from services.ai.ai_therapist import AITherapistService
from services.voice.voice_generator import VoiceGenerator
from services.voice.strategies.samantha_voice import SamanthaVoiceStrategy
from services.therapy_session.therapy_session import TherapySessionService
from services.user.user_service import UserService

from routes.auth import auth_bp
from routes.message import message_bp
from routes.therapy_session import therapy_session_bp

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        # Services
        app.text_generator = TextGenerator()
        app.voice_generator = VoiceGenerator(SamanthaVoiceStrategy())
        app.ai_therapist = AITherapistService(db.session)
        app.auth_service = AuthService(db.session)
        app.therapy_session_service = TherapySessionService(db.session)
        app.user_service = UserService(db.session)
        app.token_handler = Token(app.config["SECRET_KEY"])

        # Register blueprints with prefix /v1/app
        BASE_API_PREFIX = "/v1/unmind"

        app.register_blueprint(auth_bp, url_prefix=BASE_API_PREFIX)
        app.register_blueprint(message_bp, url_prefix=BASE_API_PREFIX)
        app.register_blueprint(therapy_session_bp, url_prefix=BASE_API_PREFIX)

    # TODO: Remove the debug=True when finish the project
    app.run(debug=True)
