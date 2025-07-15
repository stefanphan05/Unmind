from werkzeug.security import generate_password_hash, check_password_hash


def hash_password(password):
    """
    Hashes a plain-text password using bcrypt.
    """
    return generate_password_hash(password=password)


def verify_password(hashed_password, plain_password):
    """
    Verifies a plain-text password against a hashed password.
    """
    return check_password_hash(hashed_password, plain_password)
