from . import app
from flask import request, jsonify
from utils.token_required import token_required


@app.route('/start_therapy_session', methods=['POST'])
@token_required
def start_therapy_session(username):
    pass
