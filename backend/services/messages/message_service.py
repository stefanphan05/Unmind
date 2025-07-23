from typing import List
from config import db
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
