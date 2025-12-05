from typing import Optional
from backend.models import User


class UserService:
    def __init__(self, db_session):
        self.__db = db_session

    def get_username_by_email(self, email: str) -> Optional[str]:
        user = self.__db.query(User).filter_by(email=email).first()
        if user:
            return user.username

        return None
