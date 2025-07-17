from . import app
from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "username and password are required"}), 400

    username = data.get('username')
    password = data.get('password')

    success, message = app.auth_service.login_user(username, password)

    if success:
        # Generate token using the Token class instance
        token = app.token_handler.generate_token(username)

        return jsonify({"token": token}), 201
    else:
        return jsonify({"message": message}), 400


@auth_bp.route("/register", methods=["POST"])
def register():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "username and password are required"}), 400

    username = data.get('username')
    password = data.get('password')

    success, message = app.auth_service.register_user(username, password)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 400
