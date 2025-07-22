from typing import Optional, Tuple
from flask import request


def extract_text_input() -> Tuple[Optional[str], Optional[str]]:
    data = request.json
    if not data or not isinstance(data, dict):
        return None, "Invalid JSON data"

    # Get user input
    user_input = data.get('message', '').strip()
    if not user_input:
        return None, "Message content is required"

    return user_input, None
