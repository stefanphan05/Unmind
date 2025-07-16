from . import app
from flask import current_app
from flask import request, jsonify
from services.auth import login_user, register_user
from utils.token_required import token_required
from utils.token_utils import Token


@app.route("/login", methods=["POST"])
def login():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "username and password are required"}), 400

    username = data.get('username')
    password = data.get('password')

    success, message = login_user(username, password)
    if success:
        token_handler = Token()

        # Generate token using the Token class instance
        token = token_handler.generate_token(username)

        return jsonify({"token": token}), 201
    else:
        return jsonify({"message": message}), 400


@app.route("/register", methods=["POST"])
def register():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "username and password are required"}), 400

    username = data.get('username')
    password = data.get('password')

    success, message = register_user(username, password)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 400


@app.route("/testing", methods=["GET"])
@token_required
def test(username):
    return jsonify({"message": username}), 200
