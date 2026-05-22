import datetime
from typing import List, Optional

from utils.find_session import find_session_by_id_for_user
from utils.find_user import user_exists

from models import Message, TherapySession


class TherapySessionService:
    def __init__(self, db_session) -> None:
        self.__db = db_session

    def _has_user_messages(self, session_id: int) -> bool:
        return (
            self.__db.query(Message.id)
            .filter(
                Message.therapy_session_id == session_id,
                Message.role == "user",
            )
            .first()
            is not None
        )

    def get_history_sessions(self, email: str) -> List[TherapySession]:
        """Sessions that appear in history (at least one user message)."""
        session_ids_with_messages = (
            self.__db.query(Message.therapy_session_id)
            .filter(Message.email == email, Message.role == "user")
            .distinct()
        )
        return (
            self.__db.query(TherapySession)
            .filter(
                TherapySession.email == email,
                TherapySession.id.in_(session_ids_with_messages),
            )
            .order_by(TherapySession.date.desc())
            .all()
        )

    def get_all_sessions(self, email: str) -> List[TherapySession]:
        return (
            self.__db.query(TherapySession)
            .filter(TherapySession.email == email)
            .order_by(TherapySession.date.desc())
            .all()
        )

    def find_draft_session(self, email: str) -> Optional[TherapySession]:
        for session in self.get_all_sessions(email):
            if not self._has_user_messages(session.id):
                return session
        return None

    def prune_empty_sessions(self, email: str, keep_id: Optional[int] = None) -> None:
        for session in self.get_all_sessions(email):
            if keep_id is not None and session.id == keep_id:
                continue
            if not self._has_user_messages(session.id):
                self.delete_session(email, str(session.id))

    def get_or_create_draft(
        self, email: str, *, force_new: bool = False
    ) -> TherapySession:
        if force_new:
            self.prune_empty_sessions(email)
            return self.create_session(
                email=email,
                name="New conversation",
                date=datetime.datetime.now(),
                status="ongoing",
                result="pending",
            )

        draft = self.find_draft_session(email)
        if draft:
            self.prune_empty_sessions(email, keep_id=draft.id)
            return draft

        session = self.create_session(
            email=email,
            name="New conversation",
            date=datetime.datetime.now(),
            status="ongoing",
            result="pending",
        )
        return session

    def get_session(self, email: str, session_id: int) -> Optional[TherapySession]:
        return find_session_by_id_for_user(self.__db, session_id, email)

    def update_tone(self, email: str, session_id: int, tone: str) -> Optional[TherapySession]:
        session = find_session_by_id_for_user(self.__db, session_id, email)
        if not session:
            return None

        session.tone = tone
        self.__db.commit()
        return session

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

    def delete_session(self, email: str, id: str) -> bool:
        # Check if user exists
        user = user_exists(email)
        if not user:
            return False

        # Find session belonging to this user
        session = find_session_by_id_for_user(self.__db, id, email)
        if not session:
            return False

        self.__db.query(Message).filter(
            Message.therapy_session_id == session.id
        ).delete()

        self.__db.delete(session)
        self.__db.commit()

        return True
