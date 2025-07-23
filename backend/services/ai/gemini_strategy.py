from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import re
from .base_llm import LLMStrategy
from models.message import Message
from config import db


class GeminiStrategy(LLMStrategy):
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env")

        self.__model = "gemini-2.5-flash"
        self.__client = genai.Client(
            api_key=api_key
        )

    def format_messages(self, user_input: str, load_history: bool, system_prompt: str, email: str) -> any:
        """
        Convert OpenAI-style messages into a single prompt string
        """
        messages = [system_prompt]

        if load_history:
            history = db.session.query(Message).filter_by(
                email=email
            ).order_by(Message.timestamp).all()

            for msg in history:
                if msg.role == "user":
                    messages.append(f"User: {msg.content}")
                else:
                    messages.append(f"Therapist: {msg.content}")

        # Append the latest user message
        messages.append(f"User: {user_input}")
        messages.append("Therapist:")

        return "\n".join(messages)

    def generate_response(self, prompt: str) -> str:
        try:
            content = types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            )

            response = self.__client.models.generate_content(
                model=self.__model,
                contents=[content]
            )

            cleaned_response = re.sub(
                r'\*\*(.*?)\*\*', r'\1', response.text.strip())
            return cleaned_response

        except Exception as e:
            print(f"[Gemini Error] {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"
