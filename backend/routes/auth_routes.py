from . import app
from flask import request, jsonify
from services.auth_service import login_user, register_user
from utils.request_helpers import contains_username_password


@app.route("/login", methods=["POST"])
def login():
    return jsonify({"Login": "Login"})


@app.route("/register", methods=["POST"])
def register():
    # Get json data from request
    data = request.json

    # Make sure username and password exist in data
    if not contains_username_password(data):
        return jsonify({"message": "username and password are required"}), 400

    username = data.get('username')
    password = data.get('password')

    success, message = register_user(username, password)

    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400
