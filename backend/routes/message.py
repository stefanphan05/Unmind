from . import app
from flask import Blueprint, jsonify, request
from utils.token_required import token_required


message_bp = Blueprint("message", __name__)


@message_bp.route('/messages/user', methods=["POST"])
@token_required
def save_user_input(email):
    # Get json data from request
    data = request.json

    # Make sure content exists in data
    if not data or 'content' not in data:
        return jsonify({"message": "content is required"}), 400

    content = data.get('content')

    message = app.message_service.save_message(
        content=content,
        role="user",
        email=email
    )

    return jsonify(message.to_dict()), 201


@message_bp.route('/messages/ai/respond', methods=['POST'])
@token_required
def get_ai_response(email):
    # Get json data from request
    data = request.json

    # Make sure content exists in data
    if not data or 'content' not in data:
        return jsonify({"message": "content is required"}), 400

    # Get user input
    user_input = data.get('content')

    # Get AI Response
    ai_answer = app.ai_therapist.send_message(
        email=email,
        user_input=user_input
    )

    message = app.message_service.save_message(
        content=ai_answer,
        role="assistant",
        email=email
    )

    # Convert response to voice
    app.voice_generator.speak_default(message.content)

    return jsonify({"question": user_input, "answer": message.to_dict()}), 200


@message_bp.route('/messages', methods=['GET'])
@token_required
def get_all_messages(email):
    messages = app.message_service.get_all_messages(email)
    return jsonify([{
        "id": message.id,
        "content": message.content,
        "role": message.role
    } for message in messages]), 200


@message_bp.route("/messages", methods=["DELETE"])
@token_required
def delete_all_messages(email):
    app.message_service.delete_all_messages(email)
    return jsonify({"message": "All messages deleted successfully"}), 201
