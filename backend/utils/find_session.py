from typing import Optional

from backend.models.therapy_session import TherapySession


def find_session_by_id_for_user(db_session, session_id: int, email: str) -> Optional[TherapySession]:
    """
    Look up a therapy session by its ID for a specific user.
    """
    return (
        db_session.query(TherapySession)
        .filter(TherapySession.id == session_id, TherapySession.email == email)
        .first()
    )
