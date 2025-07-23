from dotenv import load_dotenv
import google.generativeai as genai
import os
import re
from .base_llm import LLMStrategy
from models.message import Message
from config import db


class GeminiStrategy(LLMStrategy):
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in .env")

        genai.configure(api_key=api_key)
        self.__model = genai.GenerativeModel("gemini-1.5-flash")

    def format_messages(self, user_input: str, session_id: str, load_history: bool, system_prompt: str) -> any:
        """
        Convert OpenAI-style messages into a single prompt string
        """
        messages = [system_prompt]

        if load_history:
            """
            Get the newest first and then [::-1] reverse back to the chronological order after get desc()
            """
            # Only load the last 5 turns
            history = db.session.query(Message).filter_by(
                therapy_session_id=session_id
            ).order_by(Message.timestamp.desc()).limit(5).all()[::-1]

            for msg in history:
                messages.append(f"User: {msg.user_input}")
                messages.append(f"Therapist: {msg.ai_response}")

        # Append the latest user message
        messages.append(f"User: {user_input}")
        messages.append("Therapist:")

        return messages

    def generate_response(self, prompt: str) -> str:
        try:
            response = self.__model.generate_content(prompt)

            cleaned_response = re.sub(
                r'\*\*(.*?)\*\*', r'\1', response.text.strip())
            return cleaned_response

        except Exception as e:
            print(f"[Gemini Error] {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"
