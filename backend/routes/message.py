from flask import Blueprint, request, current_app
from utils.token_required import token_required

from controllers.messages.message_handlers import MessageHandlers


message_bp = Blueprint("message", __name__)

message_handlers = MessageHandlers(
    message_service=current_app.message_service,
    ai_therapist=current_app.ai_therapist,
    voice_generator=current_app.voice_generator
)


@message_bp.route('/sessions/<int:therapy_session_id>/messages', methods=["POST"])
@token_required
def save_user_input(email, therapy_session_id):
    return message_handlers.handle_save_user_input(email=email, therapy_session_id=therapy_session_id, data=request.json)


@message_bp.route('/sessions/<int:therapy_session_id>/messages/ai', methods=['POST'])
@token_required
def get_ai_response(email, therapy_session_id):
    return message_handlers.handle_ai_response(email=email, therapy_session_id=therapy_session_id, data=request.json)


@message_bp.route('/sessions/<int:therapy_session_id>/messages', methods=['GET'])
@token_required
def get_all_messages(email, therapy_session_id):
    return message_handlers.handle_get_all_messages(email=email, therapy_session_id=therapy_session_id, data=request.json)


@message_bp.route("/sessions/<int:therapy_session_id>/messages", methods=["DELETE"])
@token_required
def delete_all_messages(email, therapy_session_id):
    return message_handlers.handle_delete_all_messages(email=email, therapy_session_id=therapy_session_id, data=request.json)
