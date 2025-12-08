import datetime
from typing import List, Optional

from utils.find_session import find_session_by_id_for_user
from utils.find_user import user_exists

from models import TherapySession


class TherapySessionService:
    def __init__(self, db_session) -> None:
        self.__db = db_session

    def get_all_sessions(self, email: str) -> List[TherapySession]:
        return (
            self.__db.query(TherapySession)
                .filter(TherapySession.email == email)
                .order_by(TherapySession.date.desc())
                .all()
        )

    def create_session(self, email: str, name: str, date: datetime, status: str, result: str) -> TherapySession:
        new_session = TherapySession(
            email=email,
            name=name,
            date=date,
            status=status,
            result=result
        )
        self.__db.add(new_session)
        self.__db.commit()

        return new_session

    def update_session(self, email: str, id: str, name: str, date: datetime, status: str, result: str) -> Optional[TherapySession]:
        user = user_exists(email)

        if not user:
            return None

        session = find_session_by_id_for_user(self.__db, id, email)
        if not session:
            return None

        if not session:
            return None

        session.name = name
        session.date = date
        session.status = status
        session.result = result

        self.__db.commit()
        return session
