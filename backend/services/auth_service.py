from . import db
from models import User
from utils.password import hash_password, verify_password
from utils.is_existing_user import is_existing_user


def register_user(username, password):
    # Check if user already exists
    if is_existing_user(username):
        return False, "Username already exists"

    try:
        # Use the utility function to hash the password
        hashed_password = hash_password(password)

        # Create a new user instance (only store the hashpassword instead of plain password)
        new_user = User(username=username, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return True, "User registered successfully"

    except Exception as e:
        db.session.rollback()
        return False, f"Registration failed: {str(e)}"


def login_user(username, password):
    """
    Find user by username
    Check if the password matches the stored hash passowrd
    return user or raise an error
    """
    # Check if user doesn't exists
    user = is_existing_user(username)

    if not user:
        return False, "Username doesn't exist"

    if not verify_password(user.password, password):
        return False, "Incorrect password"

    return True, "Successfully login"
