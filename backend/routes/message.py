from . import app
from flask import request, jsonify
from utils.token_required import token_required


@app.route('/message/text', methods=['POST'])
@token_required
def send_text_message(username):
    """
    Get the question from message

    if question != text:
        conver to text

    using ai -> get response by text
    convert to speech

    return answer_by_text and audio
    """

    return jsonify({"message": "message"}), 200


@app.route('/message/audio', methods=['POST'])
@token_required
def send_audio_message(username):
    """
    Get the question from message

    if question != text:
        conver to text

    using ai -> get response by text
    convert to speech

    return answer_by_text and audio
    """

    return jsonify({"message": "message"}), 200
