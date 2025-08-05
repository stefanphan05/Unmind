from typing import List
from models.therapy_session import TherapySession


class TherapySessionService:
    def __init__(self, db_session) -> None:
        self.__db = db_session

    def get_all_sessions(self, email: str) -> List[TherapySession]:
        return self.__db.query(TherapySession).filter(
            TherapySession.email == email
        ).order_by(TherapySession.date.asc()).all()

    def create_session(self, email: str) -> TherapySession:
        new_session = TherapySession(email=email)
        self.__db.add(new_session)
        self.__db.commit()

        return new_session
