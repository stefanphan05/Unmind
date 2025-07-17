from . import app
from flask import request, jsonify

from models.message import InputType

from utils.token_required import token_required
from utils.process_audio import process_audio_with_adapter


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
    # Check the Content-Type header to determine how to parse the request
    content_type = request.headers.get('Content-Type', '').lower()

    user_input = None
    input_type = None

    if 'application/json' in content_type:
        # This is the path for 'text' input
        data = request.json
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid JSON data"}), 400

        input_type = data.get('type')
        if input_type != "text":
            return jsonify({"error": "Mismatched content type and input type"}), 400

        user_input = data.get('message', '').strip()

        if not user_input:
            return jsonify({"message": "Message content is required"}), 400

    elif 'multipart/form-data' in content_type:
        # Speech type input
        input_type = request.form.get('type')
        if input_type != 'speech':
            return jsonify({"error": "Mismatched content type and input type"}), 400

        if 'audio_file' not in request.files:
            return jsonify({"message": "Audio file is required for speech input"}), 400

        audio_file = request.files['audio_file']

        if not audio_file or audio_file.filename == '':
            return jsonify({"message": "No audio file selected"}), 400

        result = process_audio_with_adapter(audio_file)

        if isinstance(result, dict) and 'error' in result:
            return jsonify(result), 400

        user_input = result["input"]

    else:
        # Handle unsupported content types
        return jsonify({'error': "Unsupported Content-Type. Use 'application/json' or 'multipart/form-data'."}),

    # Convert input_type string to InputType Enum
    try:
        input_type = InputType[input_type.upper()]
    except KeyError:
        return jsonify({"error": "Invalid input type. Use 'text' or 'speech'."}), 400

    # Get ai answer for the input
    ai_answer = app.ai_therapist.send_message(username, user_input, input_type)

    # Generate voice based on ai answer
    app.voice_generator.speak_default(ai_answer)

    return jsonify({"question": user_input, "answer": ai_answer}), 200
