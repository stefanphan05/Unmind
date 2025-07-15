from models import User


def is_existing_user(username):
    existing_user = User.query.filter_by(username=username).first()
    return existing_user
