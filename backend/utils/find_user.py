from typing import Union

from backend.models.user import User


def user_exists(email: str) -> Union[User, None]:
    """
    Checks if a user with the given email already exists in the database.

    Args:
        username (str): The email to check.

    Returns:
        Union[User, None]: The User object if the user exists, otherwise None.
    """
    return User.query.filter_by(email=email).first()
