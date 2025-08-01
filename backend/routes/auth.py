from config import app
from flask import Blueprint, request

from controllers.auth.auth_handlers import AuthHandlers

auth_bp = Blueprint("auth", __name__)

auth_handlers = AuthHandlers(
    token_handler=app.token_handler,
    auth_service=app.auth_service,
    email_service=app.email_service
)


@auth_bp.route("/signin", methods=["POST"])
def login():
    return auth_handlers.handle_login(request.json)


@auth_bp.route("/signup", methods=["POST"])
def register():
    return auth_handlers.handle_register(request.json)


@auth_bp.route("/google-signin", methods=["POST"])
def google_signin():
    return auth_handlers.handle_google_signin(request.json)


@auth_bp.route("/request-password-reset", methods=["POST"])
def request_password_reset():
    return auth_handlers.handle_password_reset_request(request.json)


@auth_bp.route("/verify-reset-code", methods=["POST"])
def verify_reset_code():
    return auth_handlers.handle_reset_code_verification(request.json)


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    return auth_handlers.handle_password_reset(request.json)
