from datetime import datetime, timezone
from typing import List
from models.therapy_session import TherapySession
from models.message import Message
from config import app


class TherapySessionService:
    def __init__(self, db_session) -> None:
        self.__db = db_session

    def __remove_existing_session(self, email: str) -> None:
        """
        Deletes all therapy sessions and associated messages for the given user
        """
        session = self.get_session(email=email)
        if not session:
            return

        # Remove all the messages related to that session
        self.__db.query(Message).filter_by(
            therapy_session_id=session.id).delete()
        self.__db.delete(session)

        self.__db.commit()

    def __create_new_session(self, email: str) -> TherapySession:
        # Get the username
        username = app.user_service.get_username_by_email(email)

        session_name = f"Session - {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}"
        new_session = TherapySession(
            email=email,
            username=username,
            session_name=session_name
        )

        self.__db.add(new_session)
        self.__db.commit()
        return new_session

    def get_session(self, email: str) -> List[TherapySession]:
        return self.__db.query(TherapySession).filter_by(email=email).first()

    def start_session(self, email: str) -> TherapySession:
        self.__remove_existing_session(email=email)
        return self.__create_new_session(email=email)

    def get_or_create_session(self, email: str) -> TherapySession:
        session = self.get_session(email=email)
        return session if session else self.__create_new_session(email=email)

    def rename_session(self, email: str, new_name: str):
        """
        Renames the current therapy session for a user
        If no session exists, it creates a new one and sets the name

        Returns:
            True if renamed successfully, False otherwise
        """
        session = self.get_or_create_session(email=email)
        session.session_name = new_name
        self.__db.commit()
        return True

    def get_messages(self, session_id) -> List[Message]:
        messages = self.__db.query(Message).filter_by(
            therapy_session_id=session_id).all()
        return messages
