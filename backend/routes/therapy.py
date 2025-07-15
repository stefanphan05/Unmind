from . import app
from flask import request, jsonify
from services.ai_therapist import process_user_input


@app.route('/conversation', methods=['POST'])
def send_message():
    data = request.json

    message = data.get('message')
    if not message:
        return jsonify({'message': "message is required"}), 400

    response = process_user_input(message)

    return jsonify(response)
