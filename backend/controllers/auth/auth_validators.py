from typing import Optional, Tuple


class AuthValidator:
    @staticmethod
    def validate_email(email: str) -> Tuple[bool, Optional[str]]:
        if not email:
            return False, "Email is required"

        return True, None

    @staticmethod
    def validate_password(password: str) -> Tuple[bool, Optional[str]]:
        if not password:
            return False, "Password is required"

        # TODO: For future implementation, adding some verification like length >8 here, not for now

        return True, None

    @staticmethod
    def validate_username(username: str) -> Tuple[bool, Optional[str]]:
        if not username:
            return False, "Username is required"

         # TODO: For future implementation, adding some verification like length >3 here, not for now

        return True, None

    @staticmethod
    def validate_login_data(data: dict) -> Tuple[bool, Optional[str]]:
        if not data:
            return False, "Request data is required"

        email = data.get("email", "")
        password = data.get("password", "")

        email_valid, email_error = AuthValidator.validate_email(email)
        if not email_valid:
            return False, email_error

        password_valid, password_error = AuthValidator.validate_password(
            password)
        if not password_valid:
            return False, password_error

        return True, None

    @staticmethod
    def validate_register_data(data: dict) -> Tuple[bool, Optional[str]]:
        if not data:
            return False, "Request data is required"

        email = data.get('email', '')
        username = data.get('username', '')
        password = data.get('password', '')

        # Validate each field
        email_valid, email_error = AuthValidator.validate_email(email)
        if not email_valid:
            return False, email_error

        username_valid, username_error = AuthValidator.validate_username(
            username)
        if not username_valid:
            return False, username_error

        password_valid, password_error = AuthValidator.validate_password(
            password)
        if not password_valid:
            return False, password_error

        return True, None
