from . import app
from flask import request, jsonify
from utils.token_required import token_required


@app.route('/message', methods=['POST'])
@token_required
def send_text_message(username):
    """
    Handles both text and speech-based user input, processes it with an AI, and returns both a text response and a generated audio file
    """

    """
    Get the question from message

    if question != text:
        conver to text

    using ai -> get response by text
    convert to speech

    return answer_by_text and audio
    """
    data = request.json
    # Get input type from json request
    input_type = data.get('type')
    user_input = None

    if input_type == "text":
        # Handle text input
        user_input = data.get('message', '').strip()

        if not user_input:
            return jsonify({"message": "Message content is required"}), 400
    elif input_type == 'speech':
        # Handle speech input from user
        if 'audio_file' not in request.files:
            return jsonify({"message": "Audio file is required for speech input"}), 400

        audio_file = request.files['audio_file']

        # No audio file is provided
        if not audio_file or audio_file.filename == '':
            return jsonify({"message": "No audio file selected"}), 400

        pass

    return jsonify({"message": "message"}), 200
