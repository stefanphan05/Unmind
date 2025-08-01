from flask import Blueprint, request

from controllers.auth.auth_handlers import AuthHandlers

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signin", methods=["POST"])
def login():
    return AuthHandlers.handle_login(request.json)


@auth_bp.route("/signup", methods=["POST"])
def register():
    return AuthHandlers.handle_register(request.json)


@auth_bp.route("/google-signin", methods=["POST"])
def google_signin():
    return AuthHandlers.handle_google_signin(request.json)


@auth_bp.route("/request-password-reset", methods=["POST"])
def request_password_reset():
    return AuthHandlers.handle_password_reset_request(request.json)


@auth_bp.route("/verify-reset-code", methods=["POST"])
def verify_reset_code():
    return AuthHandlers.handle_reset_code_verification(request.json)


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    return AuthHandlers.handle_password_reset(request.json)
