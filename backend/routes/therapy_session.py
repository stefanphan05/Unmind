from flask import Blueprint, current_app, request
from controllers.sessions.session_handlers import TherapySessionHandlers
from utils.token_required import token_required


therapy_session_bp = Blueprint("therapy_session", __name__)

therapy_session_handlers = TherapySessionHandlers(
    session_service=current_app.session_service
)


@therapy_session_bp.route('/sessions', methods=["GET"])
@token_required
def get_all_sessions(email):
    return therapy_session_handlers.handle_get_all_sessions(email)


@therapy_session_bp.route('/sessions', methods=["POST"])
@token_required
def create_session(email):
    return therapy_session_handlers.handle_session_creation(email=email, data=request.json)


@therapy_session_bp.route("/sessions", methods=["PATCH"])
@token_required
def update_session(email):
    return therapy_session_handlers.handle_update_session(email=email, data=request.json)
