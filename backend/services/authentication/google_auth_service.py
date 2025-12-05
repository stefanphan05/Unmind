from typing import Optional, Tuple
import requests

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


class GoogleAuthService:
    @staticmethod
    def verify_google_token(token: str) -> Tuple[bool, Optional[dict], Optional[str]]:
        """
        Verify Google token and return user info
        Returns:
            (success, user_info, error_message)
        """
        try:
            if token.count('.') == 2:
                user_info = id_token.verify_oauth2_token(
                    token, google_requests.Request())
                email = user_info["email"]
                name = user_info.get("name", "Anonymous")
            else:
                response = requests.get(
                    f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={token}"
                )

                if response.status_code != 200:
                    raise Exception("Invalid access token")

                user_info = response.json()
            email = user_info["email"]
            name = user_info.get("name", "Anonymous")

            if not email:
                return False, None, "Email not found in Google token"

            return True, {"email": email, "name": name}, None
        except Exception as e:
            return False, None, f"Invalid Google token: {str(e)}"
