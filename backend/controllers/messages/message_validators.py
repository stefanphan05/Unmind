from typing import Optional, Tuple


class MessageValidator:
    @staticmethod
    def validate_content(content: str) -> Tuple[bool, Optional[str]]:
        if not content:
            return False, "Content is required"

        return True, None

    @staticmethod
    def validate_user_input(data: dict) -> Tuple[bool, Optional[str]]:
        if not data:
            return False, "Request data is required"

        content = data.get('content', "")

        content_valid, content_error = MessageValidator.validate_content(
            content)
        if not content_valid:
            return False, content_error

        return True, None
