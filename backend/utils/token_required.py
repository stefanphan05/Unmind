from . import app
import jwt
from functools import wraps
from flask import request, jsonify


def token_required(func):
    """
    Decorator to protect routes by requiring a valid JWT access token
    """
    @wraps(func)
    def decorated(*args, **kwargs):
        # Get the authorization header
        auth_header = request.headers.get("Authorization", '')
        if not auth_header.startswith("Bearer "):
            return jsonify({'message': 'Token is missing or wrong formatted'}), 401

        # Extract token from the header
        token = auth_header.split(" ")[1]

        try:
            # Instantiate token handler and decode the token
            data = app.token_handler.decode_token(token)

            # Extract current user from the token payload
            current_user = data['username']

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return func(current_user, *args, **kwargs)

    return decorated
