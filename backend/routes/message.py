from . import app
from flask import Blueprint, jsonify

from utils.token_required import token_required
from utils.message_input_parse import extract_text_input


message_bp = Blueprint("message", __name__)


@message_bp.route('/ask', methods=['POST'])
@token_required
def send_text_message(username):
    user_input, error = extract_text_input()

    if error:
        return jsonify({'error': error}), 400

    # Get AI Response
    ai_answer = app.ai_therapist.send_message(
        username=username,
        user_input=user_input
    )

    # Convert response to voice
    app.voice_generator.speak_default(ai_answer)

    return jsonify({"question": user_input, "answer": ai_answer}), 200
