from datetime import datetime, timezone
from typing import List
from models.therapy_session import TherapySession
from models.message import Message


class TherapySessionService:
    def __init__(self, db_session) -> None:
        self.__db_session = db_session

    def __remove_existing_session(self, username: str) -> None:
        """
        Deletes all therapy sessions and associated messages for the given user
        """
        session = self.get_session(username=username)
        if not session:
            return

        # Remove all the messages related to that session
        self.__db_session.query(Message).filter_by(
            therapy_session_id=session.id).delete()
        self.__db_session.delete(session)

        self.__db_session.commit()

    def __create_new_session(self, username: str) -> TherapySession:
        session_name = f"Session - {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}"
        new_session = TherapySession(
            username=username, session_name=session_name)
        self.__db_session.add(new_session)
        self.__db_session.commit()
        return new_session

    def get_session(self, username: str) -> List[TherapySession]:
        return self.__db_session.query(TherapySession).filter_by(username=username).first()

    def start_session(self, username: str) -> TherapySession:
        self.__remove_existing_session(username=username)
        return self.__create_new_session(username=username)

    def get_or_create_session(self, username: str) -> TherapySession:
        session = self.get_session(username=username)
        return session if session else self.__create_new_session(username=username)

    def rename_session(self, username: str, new_name: str):
        """
        Renames the current therapy session for a user
        If no session exists, it creates a new one and sets the name

        Returns:
            True if renamed successfully, False otherwise
        """
        session = self.get_or_create_session(username=username)
        session.session_name = new_name
        self.__db_session.commit()
        return True

    def get_messages(self, session_id) -> List[Message]:
        messages = self.__db_session.query(Message).filter_by(
            therapy_session_id=session_id).all()
        return messages
