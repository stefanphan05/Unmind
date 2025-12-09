from flask import Blueprint, current_app, request
from controllers.voice.voice_handler import VoiceHandler
from utils.token_required import token_required


voice_bp = Blueprint("voice", __name__)


@voice_bp.route('/voice/switch', methods=["POST"])
@token_required
def switch_voice(email):
    """
    Switch between different voices by changing the voice_id
    """
    voice_handler = VoiceHandler(current_app.voice_generator)
    return voice_handler.handle_switch_voice(request.json)


@voice_bp.route('/voice/current', methods=["GET"])
@token_required
def get_current_voice(email):
    """
    Get the currently active voice and list of available voices.
    """
    voice_controller = VoiceHandler(current_app.voice_generator)
    return voice_controller.handle_get_current_voice()
