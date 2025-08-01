from datetime import datetime, timedelta, timezone
from typing import List
from models.message import Message


class MessageService:
    def __init__(self, db_session) -> None:
        self.__db = db_session

    def save_message(self, content: str, role: str, email: str) -> Message:
        new_message = Message(
            content=content,
            role=role,
            email=email
        )
        self.__db.add(new_message)
        self.__db.commit()

        return new_message

    def get_all_messages(self, email: str) -> List[Message]:
        return self.__db.query(Message).filter(Message.email == email).order_by(
            Message.timestamp.asc()).all()

    def delete_all_messages(self, email: str) -> None:
        # Delete all the existing message
        self.__db.query(Message).filter(Message.email == email).delete()

        # Add the default message
        self.create_default_message(email)
        self.__db.commit()

    def create_default_message(self, email: str) -> None:
        # Get the current date and time
        now = datetime.now(timezone.utc)

        # Subtract 1 year from the current date
        one_year_ago = now - timedelta(days=365)

        # Create the default message with the modified timestamp
        default_message = Message(
            content="Hey, I’m here for you. Whatever’s on your mind, you can talk to me.",
            role="assistant",
            email=email,
            timestamp=one_year_ago
        )

        self.__db.add(default_message)
        self.__db.commit()
