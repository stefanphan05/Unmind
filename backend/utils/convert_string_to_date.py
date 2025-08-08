from datetime import datetime
from typing import Optional


def convert_to_date(date_str: str) -> Optional[datetime]:
    """
    Converts a 'YYYY-MM-DD' string to a datetime object.
    Returns None if the format is invalid.
    """
    if not date_str or not isinstance(date_str, str):
        return None

    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return None
