from flask import jsonify


def contains_username_password(data):
    """
    Making sure 'username' and 'password' existed in data
    """
    return data and 'username' in data and 'password' in data
