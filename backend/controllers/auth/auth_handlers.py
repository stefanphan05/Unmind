from services.authentication.google_auth_service import GoogleAuthService
from config import app
from controllers.auth.auth_validators import AuthValidator
from utils.response_helpers import ResponseHelper


class AuthHandlers:
    @staticmethod
    def handle_login(data: dict):
        valid, error = AuthValidator.validate_login_data(data)
        if not valid:
            return ResponseHelper.validation_error(error)

        email = data.get("email")
        password = data.get("password")

        success, message = app.auth_service.login_user(email, password)

        if success:
            # Generate token using the Token class instance
            token = app.token_handler.generate_token(email)

            return ResponseHelper.success_response({"token": token}, status_code=201)
        else:
            return ResponseHelper.unauthorized_error(message)

    @staticmethod
    def handle_register(data: dict):
        valid, error = AuthValidator.validate_login_data(data)
        if not valid:
            return ResponseHelper.validation_error(error)

        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        success, message = app.auth_service.register_user(
            email, username, password)

        if success:
            return ResponseHelper.success_response(message=message)
        else:
            return ResponseHelper.error_response(message)

    @staticmethod
    def handle_google_signin(data: dict):
        token = data.get("credential") or data.get("access_token")

        if not token:
            return ResponseHelper.validation_error("Missing Google credential")

        # Verify Google token
        success, user_info, error = GoogleAuthService.verify_google_token(
            token)
        if not success:
            return ResponseHelper.unauthorized_error(error)

        email = user_info.get("email")
        name = user_info.get("name")

        # Register user if not exists
        if not app.auth_service.user_exists(email):
            app.auth_service.register_user(email, name, "")

        # Generate app token
        app_token = app.token_handler.generate_token(email)
        return ResponseHelper.success_response({"token": app_token})

    @staticmethod
    def handle_password_reset_request(data: dict):
        email = data.get("email")

        success, error = AuthValidator.validate_email(email)
        if not success:
            return ResponseHelper.validation_error(error)

        if not app.auth_service.user_exists(email):
            return ResponseHelper.not_found_error("User with this email does not exist")

        app.email_service.send_password_reset_code(email)
        return ResponseHelper.success_response(message="Reset email sent")

    @staticmethod
    def handle_reset_code_verification(data: dict):
        email = data.get("email")
        code = data.get("code")

        if not email or not code:
            return ResponseHelper.validation_error("Code and email are required")

        success, message = app.email_service.verify_reset_code(email, code)
        if not success:
            return ResponseHelper.error_response(message)

        token = app.token_handler.generate_reset_token(email)
        return ResponseHelper.success_response({"token": token})

    @staticmethod
    def handle_password_reset(data: dict):
        token = data.get("token")
        new_password = data.get("new_password")

        if not token or not new_password:
            return ResponseHelper.validation_error("Tokena and new password are required")

        # Validate new password
        success, error = AuthValidator.validate_password(new_password)
        if not success:
            return ResponseHelper.validation_error(error)

        try:
            # Exact email from token
            email = app.token_handler.verify_reset_token(token)
        except Exception as e:
            return ResponseHelper.unauthorized_error(f"Invalid or expired token: {str(e)}")

        success, message = app.auth_service.update_password(
            email, new_password)

        if success:
            return ResponseHelper.success_response(message="Password reset successful")
        else:
            return ResponseHelper.error_response(message)
