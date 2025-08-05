from flask import Blueprint, jsonify, request, current_app
from utils.token_required import token_required


therapy_session_bp = Blueprint("therapy_session", __name__)


@therapy_session_bp.route('/sessions', methods=["GET"])
def get():
    return jsonify({"message": "Hi"}), 200
