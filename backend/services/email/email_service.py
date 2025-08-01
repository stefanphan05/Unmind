import random
from flask_mailman import EmailMessage


class EmailService:
    def __init__(self):
        pass

    def generate_reset_code(self):
        return str(random.randint(100000, 999999))

    def send_password_reset_code(self, recipient_email):
        # Generate reset code
        code = self.generate_reset_code()

        subject = "🔐 Password Reset Request - Action Required"
        body = self.__create_password_reset_body(code)
        self.__send_email(recipient_email, subject, body)

    def __create_password_reset_body(self, code):
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

    def __send_email(self, recipient_email, subject, body):
        msg = EmailMessage(
            subject=subject,
            to=[recipient_email],
            body=body
        )
        msg.send()
