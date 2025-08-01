from config import app, db
from utils.token_utils import Token
from redis import Redis

from services.authentication.auth import AuthService
from services.text.text_generator import TextGenerator
from services.ai.ai_therapist import AITherapistService
from services.voice.voice_generator import VoiceGenerator
from services.voice.strategies.samantha_voice import SamanthaVoiceStrategy
from services.user.user_service import UserService
from services.messages.message_service import MessageService
from services.email.email_service import EmailService

from routes.auth import auth_bp
from routes.message import message_bp

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        redis_client = Redis(
            host="localhost",
            port=6379,
            decode_responses=False
        )

        # Services
        app.text_generator = TextGenerator()
        app.voice_generator = VoiceGenerator(SamanthaVoiceStrategy())
        app.ai_therapist = AITherapistService(db.session)
        app.auth_service = AuthService(db.session)
        app.user_service = UserService(db.session)
        app.message_service = MessageService(db.session)
        app.email_service = EmailService(redis_client)
        app.token_handler = Token(app.config["SECRET_KEY"])

        # Register blueprints with prefix /v1/app
        BASE_API_PREFIX = "/v1/unmind"

        app.register_blueprint(auth_bp, url_prefix=BASE_API_PREFIX)
        app.register_blueprint(message_bp, url_prefix=BASE_API_PREFIX)

    # TODO: Remove the debug=True when finish the project
    app.run(debug=True)
