import sys
import os

from flask import Flask
from .settings import Config
from .extensions import db, cors, mail


# Ensure the backend directory is in the path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app)
    mail.init_app(app)

    with app.app_context():
        db.create_all()

        # Importing
        from utils.token_utils import Token
        from redis import Redis
        from services.sessions.session_service import TherapySessionService
        from services.email.email_service import EmailService
        from services.messages.message_service import MessageService
        from services.user.user_service import UserService
        from services.voice.strategies.samantha_voice import SamanthaVoiceStrategy
        from services.voice.voice_generator import VoiceGenerator
        from services.ai.therapist import AITherapistService
        from services.text.text_generator import TextGenerator
        from services.authentication.auth import AuthService

        # External dependencies
        redis_client = Redis(host="localhost", port=6379,
                             decode_responses=False)

        # Services
        app.text_generator = TextGenerator()
        app.voice_generator = VoiceGenerator(SamanthaVoiceStrategy())
        app.ai_therapist = AITherapistService()

        app.auth_service = AuthService(db.session)
        app.user_service = UserService(db.session)
        app.message_service = MessageService(db.session)
        app.session_service = TherapySessionService(db.session)
        app.email_service = EmailService(redis_client)
        app.token_handler = Token(app.config["SECRET_KEY"])

        # Register routes
        from routes.auth import auth_bp
        from routes.message import message_bp
        from routes.therapy_session import therapy_session_bp

        BASE_API_PREFIX = "/v1/unmind"
        app.register_blueprint(auth_bp, url_prefix=BASE_API_PREFIX)
        app.register_blueprint(message_bp, url_prefix=BASE_API_PREFIX)
        app.register_blueprint(therapy_session_bp, url_prefix=BASE_API_PREFIX)

    return app
