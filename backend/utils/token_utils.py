import jwt
from flask import current_app
from datetime import datetime, timedelta, timezone


class Token:
    """
    A class for generating and decoding JSON Web Tokens (JWT)
    """

    def __init__(self, secret: str, algorithm: str = "HS256", expires_in: int = None) -> None:
        self.__secret = secret
        self.__algorithm = algorithm
        self.__expires_in = expires_in  # Token will never expire

    def generate_token(self, email: str) -> str:
        """
        Generates a JWT token for a given username. The token includes the username and an expiration timestamp
        """
        username = current_app.user_service.get_username_by_email(email)

        payload = {
            "email": email,
            "username": username
        }

        # Encode the payload into a JWT using the configured secret and algorithm
        return jwt.encode(
            payload,
            self.__secret,
            algorithm=self.__algorithm
        )

    def decode_token(self, token: str) -> dict:
        """
        Decodes and validates a JWT token
        """
        return jwt.decode(
            token,
            self.__secret,
            algorithms=[self.__algorithm]
        )

    def generate_reset_token(self, email: str, expires_in: int = 900) -> str:
        """
        Generates a JWT token for password reset (15 mins)
        """
        payload = {
            "email": email,
            "purpose": "reset_password",
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_in)
        }

        return jwt.encode(payload, self.__secret, algorithm=self.__algorithm)

    def verify_reset_token(self, token: str) -> str:
        """
        Decodes and verifies a password reset token

        Returns:
            str: the email embedded in the token
        """
        try:
            payload = jwt.decode(token, self.__secret,
                                 algorithms=[self.__algorithm])

            if payload.get("purpose") != "reset_password":
                raise ValueError("Invalid token purpose")

            return payload["email"]
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError("Reset token has expired")
        except jwt.InvalidTokenError as e:
            raise jwt.InvalidTokenError(f"Invalid reset token: {str(e)}")
