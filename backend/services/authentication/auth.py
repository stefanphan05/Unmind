from datetime import datetime, timedelta, timezone
from models import User, Message, TherapySession
from werkzeug.security import generate_password_hash, check_password_hash

# Types
from sqlalchemy.orm import Session
from typing import Tuple, Union


class AuthService:
    """
    A service class to handle user authentication operations like registration and login
    """

    def __init__(self, db_session: Session) -> None:
        self.__db = db_session

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
            new_user = User(
                email=email,
                username=username,
                password=hashed_password
            )
            self.__db.add(new_user)
            self.__db.flush()

            # Create a therapy session for the new user
            therapy_session = TherapySession(email=email)
            self.__db.add(therapy_session)
            self.__db.flush()

            # Subtract 1 year from the current date
            one_year_ago = datetime.now(timezone.utc) - timedelta(days=365)

            # Create the default message with the modified timestamp
            default_message = Message(
                content="Hey, I’m here for you. Whatever’s on your mind, you can talk to me.",
                role="assistant",
                email=email,
                therapy_session_id=therapy_session.id,
                timestamp=one_year_ago
            )
            self.__db.add(default_message)

            self.__db.commit()
            return True, "User registered successfully"

        except Exception as e:
            self.__db.rollback()
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

    def update_password(self, email: str, new_password: str) -> Tuple[bool, str]:
        """
        Updates the password for a user

        Args:
            email (str): The email of the user whose password is to be updated
            new_password (str): The new plain-text password

        Returns:
            Tuple[bool, str]: A tuple indicating success/failure and a message
        """
        user = self.user_exists(email)

        if not user:
            return False, "User with this email does not exist"
        try:
            # Hash the new password
            hashed_password = generate_password_hash(new_password)

            # Update and commit changes
            user.password = hashed_password
            self.__db.commit()

            return True, "Password updated successfully"

        except Exception as e:
            self.__db.rollback()
            return False, f"Registration failed: {str(e)}"
