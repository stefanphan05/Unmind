from flask import Flask

from .extensions import db, cors, mail
from .settings import Config
from redis import Redis

from services.authentication.auth import AuthService
from services.text.text_generator import TextGenerator
from services.ai.therapist import AITherapistService
from services.voice.voice_generator import VoiceGenerator
from services.voice.strategies.samantha_voice import SamanthaVoiceStrategy
from services.user.user_service import UserService
from services.messages.message_service import MessageService
from services.email.email_service import EmailService
from services.sessions.session_service import TherapySessionService

from utils.token_utils import Token


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app)
    mail.init_app(app)

    with app.app_context():
        db.create_all()

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
