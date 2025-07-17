from . import app
from flask import jsonify

from utils.token_required import token_required
from utils.message_input_parse import get_request_content_type, extract_text_input, extract_speech_input


@app.route('/message', methods=['POST'])
@token_required
def send_text_message(username):
    # Check the Content-Type header to determine how to parse the request
    content_type = get_request_content_type()

    user_input = None
    input_type = None
    error = None

    if 'application/json' in content_type:
        user_input, error, input_type = extract_text_input()
    elif 'multipart/form-data' in content_type:
        user_input, error, input_type = extract_speech_input()
    else:
        error = "Unsupported Content-Type. Use 'application/json' or 'multipart/form-data'."

    if error:
        return jsonify({'error': error}), 400

    # Get AI Response
    ai_answer = app.ai_therapist.send_message(
        username=username,
        user_input=user_input,
        input_type=input_type
    )

    # Convert response to voice
    app.voice_generator.speak_default(ai_answer)

    return jsonify({"question": user_input, "answer": ai_answer}), 200
