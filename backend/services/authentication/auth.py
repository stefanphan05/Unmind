from datetime import datetime, timedelta, timezone
from models import User
from werkzeug.security import generate_password_hash, check_password_hash

# Types
from sqlalchemy.orm import Session
from typing import Tuple, Union

from models.message import Message

from config import app


class AuthService:
    """
    A service class to handle user authentication operations like registration and login
    """

    def __init__(self, db_session: Session) -> None:
        self.__db_session = db_session

    def register_user(self, email: str, username: str, password: str) -> Tuple[bool, str]:
        """
        Registers a new user in the database.

        Args:
            username (str): The username for the new user.
            password (str): The plain-text password for the new user.

        Returns:
            Tuple[bool, str]: A tuple containing a boolean (True for success, False for failure)
                               and a message string.
        """

        if self.user_exists(email):
            return False, "Email already exists"

        try:
            hashed_password = generate_password_hash(password)

            # Create a new user instance (only store the hashpassword instead of plain password)
            new_user = User(email=email, username=username,
                            password=hashed_password)

            # Create a default message
            app.message_service.create_default_message(email)

            self.__db_session.add(new_user)
            self.__db_session.commit()

            return True, "User registered successfully"

        except Exception as e:
            self.__db_session.rollback()
            return False, f"Registration failed: {str(e)}"

    def login_user(self, email: str, password: str) -> Tuple[bool, str]:
        """
        Find user by username
        Check if the password matches the stored hash passowrd
        return user or raise an error
        """

        user = self.user_exists(email)

        if not user:
            return False, "Email doesn't exist"

        if not check_password_hash(user.password, password):
            return False, "Incorrect password"

        return True, "Successfully login"

    def user_exists(self, email: str) -> Union[User, None]:
        """
        Checks if a user with the given email already exists in the database.

        Args:
            username (str): The email to check.

        Returns:
            Union[User, None]: The User object if the user exists, otherwise None.
        """
        return User.query.filter_by(email=email).first()
