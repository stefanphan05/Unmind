import random
import redis

from typing import Tuple
from datetime import timedelta
from flask_mailman import EmailMessage


class EmailService:
    """
    A service class for handling password reset operations,
    including code generation, email sending, Redis storage,
    and verification.
    """

    def __init__(self, redis_client: redis.Redis):
        self.__redis = redis_client

    def generate_reset_code(self) -> str:
        """
        Generate a 6-digit numeric reset code.

        Returns:
            str: A 6-digit code as a string.
        """
        return str(random.randint(100000, 999999))

    def send_password_reset_code(self, recipient_email: str) -> None:
        """
        Generate a reset code, store it in Redis, and send it via email.

        Args:
            recipient_email (str): The email address to send the reset code to.
        """

        # Generate reset code
        code = self.generate_reset_code()

        # Save to Redis: key=email, value=code, expires in 15 minutes
        self.__redis.setex(
            f"reset_code:{recipient_email}", timedelta(minutes=15), code)

        # Email Content
        subject = "🔐 Password Reset Request - Action Required"
        body = self.__create_password_reset_body(code)

        # Send email
        self.__send_email(recipient_email, subject, body)

    def verify_reset_code(self, email: str, code_input: str) -> Tuple[bool, str]:
        """
        Verify the reset code entered by the user.

        Args:
            email (str): The email address associated with the reset request.
            code_input (str): The code input by the user.

        Returns:
            Tuple[bool, str]: A tuple containing a boolean indicating success,
                              and a message describing the result.
        """

        stored_code = self.__redis.get(f"reset_code:{email}")

        if stored_code is None:
            return False, "Reset code expired or not found."
        if stored_code.decode() != code_input:
            return False, "Invalid reset code"

        # Code is valid, delete from Redis to prevent reuse
        self.__redis.delete(f"reset_code:{email}")
        return True, "Code verified"

    def __create_password_reset_body(self, code: str) -> str:
        return f"""
        Hi there! 👋

        We received a request to reset your password. To complete this process, please use the verification code below:

        🔑 Your Reset Code: {code}

        This code will expire in 15 minutes for security purposes.

        If you didn't request this password reset, please ignore this email - your account remains secure.

        Need help? Feel free to contact our support team.

        Best regards,
        The Security Team

        ---
        This is an automated message, please do not reply to this email.
        """

    def __send_email(self, recipient_email: str, subject: str, body: str) -> None:
        msg = EmailMessage(
            subject=subject,
            to=[recipient_email],
            body=body
        )
        msg.send()
