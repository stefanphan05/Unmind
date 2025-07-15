from . import db
from models import User
from utils.password import hash_password, verify_password


def register_user(username, password):
    # Check if user already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
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
    pass
