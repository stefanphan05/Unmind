from flask import Blueprint, jsonify, request, current_app
from utils.token_required import token_required


message_bp = Blueprint("message", __name__)


@message_bp.route('/sessions/<int:therapy_session_id>/messages', methods=["POST"])
@token_required
def save_user_input(email, therapy_session_id):
    # Get json data from request
    data = request.json

    # Make sure content exists in data
    if not data or 'content' not in data:
        return jsonify({"message": "content is required"}), 400

    content = data.get('content')

    message = current_app.message_service.save_message(
        content=content,
        role="user",
        email=email,
        therapy_session_id=therapy_session_id
    )

    return jsonify(message.to_dict()), 201


@message_bp.route('/sessions/<int:therapy_session_id>/messages/ai', methods=['POST'])
@token_required
def get_ai_response(email, therapy_session_id):
    # Get json data from request
    data = request.json

    # Make sure content exists in data
    if not data or 'content' not in data:
        return jsonify({"message": "content is required"}), 400

    # Get user input
    user_input = data.get('content')

    # Get AI Response
    ai_answer = current_app.ai_therapist.send_message(
        email=email,
        user_input=user_input
    )

    message = current_app.message_service.save_message(
        content=ai_answer,
        role="assistant",
        email=email,
        therapy_session_id=therapy_session_id
    )

    # Convert response to voice
    current_app.voice_generator.speak_default(message.content)

    return jsonify({"question": user_input, "answer": message.to_dict()}), 200


@message_bp.route('/sessions/<int:therapy_session_id>/messages', methods=['GET'])
@token_required
def get_all_messages(email, therapy_session_id):
    messages = current_app.message_service.get_all_messages(
        email, therapy_session_id)
    return jsonify([{
        "id": message.id,
        "content": message.content,
        "role": message.role
    } for message in messages]), 200


@message_bp.route("/sessions/<int:therapy_session_id>/messages", methods=["DELETE"])
@token_required
def delete_all_messages(email, therapy_session_id):
    current_app.message_service.delete_all_messages(email, therapy_session_id)
    return jsonify({"message": "All messages deleted successfully"}), 201
