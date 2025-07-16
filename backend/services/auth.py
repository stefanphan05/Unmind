from models import User
from werkzeug.security import generate_password_hash, check_password_hash

# Types
from sqlalchemy.orm import Session
from typing import Tuple, Union


class AuthService:
    """
    A service class to handle user authentication operations like registration and login
    """

    def __init__(self, db_session: Session) -> None:
        self.__db_session = db_session

    def register_user(self, username: str, password: str) -> Tuple[bool, str]:
        """
        Registers a new user in the database.

        Args:
            username (str): The username for the new user.
            password (str): The plain-text password for the new user.

        Returns:
            Tuple[bool, str]: A tuple containing a boolean (True for success, False for failure)
                               and a message string.
        """

        if self.__get_user(username):
            return False, "Username already exists"

        try:
            hashed_password = generate_password_hash(password)

            # Create a new user instance (only store the hashpassword instead of plain password)
            new_user = User(username, hashed_password)

            self.__db_session.add(new_user)
            self.__db_session.commit()

            return True, "User registered successfully"

        except Exception as e:
            self.__db_session.rollback()
            return False, f"Registration failed: {str(e)}"

    def login_user(self, username: str, password: str) -> Tuple[bool, str]:
        """
        Find user by username
        Check if the password matches the stored hash passowrd
        return user or raise an error
        """

        user = self.__get_user(username)

        if not user:
            return False, "Username doesn't exist"

        if not check_password_hash(user.password, password):
            return False, "Incorrect password"

        return True, "Successfully login"

    def __get_user(self, username: str) -> Union[User, None]:
        """
        Checks if a user with the given username already exists in the database.

        Args:
            username (str): The username to check.

        Returns:
            Union[User, None]: The User object if the user exists, otherwise None.
        """
        return User.query.filter_by(username=username).first()
