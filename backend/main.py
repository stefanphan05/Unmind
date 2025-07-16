from config import app, db
from routes import auth
from services.auth import AuthService
from utils.token_utils import Token

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        app.auth_service = AuthService(db.session)
        app.token_handler = Token(app.config["SECRET_KEY"])

    # TODO: Remove the debug=True when finish the project
    app.run(debug=True)
