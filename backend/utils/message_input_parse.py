from typing import Optional, Tuple
from flask import request
from utils.process_audio import process_audio_with_adapter


def get_request_content_type():
    return request.headers.get('Content-Type', '').lower()


def extract_text_input() -> Tuple[Optional[str], Optional[str], Optional[str]]:
    data = request.json
    if not data or not isinstance(data, dict):
        return None, "Invalid JSON data", None

    if data.get('type') != "text":
        return None, "Mismatched content type and input type", None

    user_input = data.get('message', '').strip()
    if not user_input:
        return None, "Message content is required", None

    return user_input, None, 'text'


def extract_speech_input() -> Tuple[Optional[str], Optional[str], Optional[str]]:
    if request.form.get('type') != 'speech':
        return None, "Mismatched content type and input type", None

    audio_file = request.files['audio_file']
    if not audio_file or not audio_file.filename:
        return None, "Audio file is required for speech input", None

    result = process_audio_with_adapter(audio_file)
    if isinstance(result, dict) and 'error' in result:
        return None, result['error'], None

    return result['input'], None, 'speech'
