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

        subject = "Your Password Reset Code"
        body = f"Your password reset code is: {code}"
        self.__send_email(recipient_email, subject, body)

    def __send_email(self, recipient_email, subject, body):
        msg = EmailMessage(
            subject=subject,
            to=[recipient_email],
            body=body
        )
        msg.send()
