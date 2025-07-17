import jwt
from datetime import datetime, timedelta, timezone


class Token:
    """
    A class for generating and decoding JSON Web Tokens (JWT)
    """

    def __init__(self, secret: str, algorithm: str = "HS256", expires_in: int = 10000) -> None:
        self.__secret = secret
        self.__algorithm = algorithm
        self.__expires_in = expires_in

    def generate_token(self, username: str) -> str:
        """
        Generates a JWT token for a given username. The token includes the username and an expiration timestamp
        """
        payload = {
            "username": username,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=self.__expires_in)
        }

        # Encode the payload into a JWT using the configured secret and algorithm
        return jwt.encode(
            payload,
            self.__secret,
            self.__algorithm
        )

    def decode_token(self, token: str) -> dict:
        """
        Decodes and validates a JWT token
        """
        return jwt.decode(
            token,
            self.__secret,
            [self.__algorithm]
        )
