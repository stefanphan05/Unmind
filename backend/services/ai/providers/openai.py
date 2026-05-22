from dotenv import load_dotenv
import openai
import os
from .base_llm import LLMStrategy

from models.message import Message

from config.extensions import db


class OpenAIStrategy(LLMStrategy):
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in .env")

        self.__client = openai.OpenAI()
        self.__model = "gpt-3.5-turbo"

    def format_messages(
        self,
        user_input: str,
        load_history: bool,
        system_prompt: str,
        email: str,
        therapy_session_id: int | None = None,
    ):
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        if load_history:
            query = db.session.query(Message).filter_by(email=email)
            if therapy_session_id is not None:
                query = query.filter_by(therapy_session_id=therapy_session_id)
            history = query.order_by(Message.timestamp).all()

            for msg in history:
                messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": user_input})

        return messages

    def generate_response(self, messages):
        response = self.__client.chat.completions.create(
            model=self.__model,
            messages=messages
        )

        return response.choices[0].message.content.strip()
