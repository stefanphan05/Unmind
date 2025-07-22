from dotenv import load_dotenv
import openai
import os
from .base_llm import LLMStrategy
from models.message import Message
from config import db


class OpenAIStrategy(LLMStrategy):
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in .env")

        self.__client = openai.OpenAI()
        self.__model = "gpt-4o-mini"

    def format_messages(self, user_input: str, session_id: str, load_history: bool, system_prompt: str):
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        if load_history:
            """
            Get the newest first and then [::-1] reverse back to the chronological order after get desc()
            """
            # Only load the last 5 turns
            history = db.session.query(Message).filter_by(
                therapy_session_id=session_id
            ).order_by(Message.timestamp.desc()).limit(5).all()[::-1]

            for msg in history:
                messages.append(
                    {"role": "user", "content": msg.user_input}
                )

                messages.append(
                    {"role": "assistant", "content": msg.ai_response}
                )

        # Append the latest user message
        messages.append({"role": "user", "content": user_input})

        return messages

    def generate_response(self, messages):
        response = self.__client.chat.completions.create(
            model=self.__model,
            messages=messages
        )

        return response.choices[0].message.content.strip()
