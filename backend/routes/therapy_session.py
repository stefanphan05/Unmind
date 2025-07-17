from . import app
from flask import Blueprint, jsonify, request

from utils.token_required import token_required


therapy_session_bp = Blueprint("therapy_session", __name__)


@therapy_session_bp.route('/start_therapy_session', methods=['POST'])
@token_required
def start_therapy_session(username):
    session = app.therapy_session_service.start_session(username)
    return jsonify({"message": f"Successfully created a new therapy session ({session.session_name}) for {username}"})


@therapy_session_bp.route('/rename_therapy_session', methods=['POST'])
@token_required
def rename_therapy_session(username):
    data = request.json

    # Make sure newName exists in data
    if not data or 'newName' not in data:
        return jsonify({"message": "New session name is required"}), 400

    new_name = data['newName']

    # Make sure new_name is not empty
    if not new_name.strip():
        return jsonify({"message": "New session name cannot be empty"}), 400

    app.therapy_session_service.rename_session(username, new_name)
    return jsonify({"message": f"Therapy session renamed to: {new_name.strip()}"}), 200


@therapy_session_bp.route('/session', methods=['GET'])
@token_required
def get_session(username):
    session = app.therapy_session_service.get_session(username)
    messages = app.therapy_session_service.get_messages(session.id)
    return jsonify({"message": f"{messages}"}), 200
