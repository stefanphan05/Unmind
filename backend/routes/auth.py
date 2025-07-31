import requests
from . import app
from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signin", methods=["POST"])
def login():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "email and password are required"}), 400

    email = data.get('email')
    password = data.get('password')

    success, message = app.auth_service.login_user(email, password)

    if success:
        # Generate token using the Token class instance
        token = app.token_handler.generate_token(email)

        return jsonify({"token": token}), 201
    else:
        return jsonify({"message": message}), 400


@auth_bp.route("/signup", methods=["POST"])
def register():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not data or 'email' not in data or 'password' not in data or 'username' not in data:
        return jsonify({"message": "email, username and password are required"}), 400

    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    success, message = app.auth_service.register_user(
        email, username, password)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 400


@auth_bp.route("/google-signin", methods=["POST"])
def google_signin():
    data = request.json
    token = data.get("credential") or data.get("access_token")

    if not token:
        return jsonify({"message": "Missing Google credential"}), 400

    try:
        if token.count('.') == 2:
            user_info = id_token.verify_oauth2_token(
                token, google_requests.Request())
            email = user_info["email"]
            name = user_info.get("name", "Anonymous")
        else:
            response = requests.get(
                f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={token}"
            )

            if response.status_code != 200:
                raise Exception("Invalid access token")

            user_info = response.json()
            email = user_info["email"]
            name = user_info.get("name", "Anonymous")

        # Register user if not exists
        if not app.auth_service.user_exists(email):
            app.auth_service.register_user(email, name, "")

        app_token = app.token_handler.generate_token(email)

        return jsonify({"token": app_token}), 200
    except Exception as e:
        return jsonify({"message": f"Invalid Google token: {str(e)}"}), 400


@auth_bp.route("/request-password-reset", methods=["POST"])
def request_password_reset():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = app.auth_service.user_exists(email)
    if not user:
        return jsonify({"message": "User with this email does not exist"}), 404

    # Generate a reset token
    token = app.token_handler.generate_reset_token(email)

    # Send email with token
    # TODO: Send email with token for user email

    return jsonify({"message": "Reset email sent"}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"message": "Token and new password are required"}), 400

    try:
        # Exact email from token
        email = app.token_handler.verify_reset_token(token)
    except Exception as e:
        return jsonify({"message": f"Invalid or expired token: {str(e)}"}), 400

    success, message = app.auth_service.update_password(email, new_password)

    if success:
        return jsonify({"message": "Password reset successful"}), 200
    else:
        return jsonify({"message": message}), 400
