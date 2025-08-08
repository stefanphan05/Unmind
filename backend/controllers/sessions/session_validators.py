from typing import Optional, Tuple


class SessionValidator:
    REQUIRED_FIELDS = {
        "name": "Session name is required",
        "date": "Session date is required",
        "status": "Session status is required",
        "result": "Session result is required"
    }

    @staticmethod
    def validate_user_input(data: dict) -> Tuple[bool, Optional[str]]:
        if not data:
            return False, "Request data is required"

        for field, error_msg in SessionValidator.REQUIRED_FIELDS.items():
            if not data.get(field):
                return False, error_msg

        return True, None
