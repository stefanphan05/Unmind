from typing import Optional, Tuple


class SessionValidator:
    REQUIRED_FIELDS_FOR_CREATION = {
        "name": "Session name is required",
        "status": "Session status is required",
        "result": "Session result is required"
    }

    REQUIRED_FIELDS_FOR_UPDATE = {
        "id": "Session id is required",
        "name": "Session name is required",
        "status": "Session status is required",
        "result": "Session result is required",
    }

    @staticmethod
    def validate_user_input_for_creation(data: dict) -> Tuple[bool, Optional[str]]:
        if not data:
            return False, "Request data is required"

        for field, error_msg in SessionValidator.REQUIRED_FIELDS_FOR_CREATION.items():
            if not data.get(field):
                return False, error_msg

        return True, None

    @staticmethod
    def validate_user_input_for_update(data: dict) -> Tuple[bool, Optional[str]]:
        if not data:
            return False, "Request data is required"

        for field, error_msg in SessionValidator.REQUIRED_FIELDS_FOR_UPDATE.items():
            if not data.get(field):
                return False, error_msg

        return True, None
