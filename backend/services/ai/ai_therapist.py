import os
import google.generativeai as genai
from dotenv import load_dotenv

from . import app

from typing import Dict, List
from models.message import Message

import re


class AITherapistService:
    def __init__(self, db_session) -> None:
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in .env")

        genai.configure(api_key=api_key)
        self.__model = genai.GenerativeModel("gemini-1.5-flash")
        self.__db_session = db_session

    def __system_prompt(self, username: str) -> str:
        prompt = f"""
            You are an AI therapist helping {username} in a speech therapy session.

            Your role:
            - Provide emotional support and guidance
            - Help users process their thoughts and feelings
            - Offer coping strategies and techniques
            - Encourage self-reflection and personal growth

            You now have access to full conversation history of this session. Use it to:
            - Reference what the user has shared earlier (e.g., emotions, events, struggles)
            - Maintain continuity in the conversation and avoid repeating advice
            - Deepen the conversation based on previously shared thoughts
            - Recognize patterns or changes in emotinoal tone
            - Help the user reflect on their progress

            Guidelines:
            1. Always response with empathy and understanding
            2. Ask open-ended questions to encourage sharing
            3. Validate the user's feelings and experiences
            4. Offer practical coping strategies when appropriate
            5. Keep responses conversational and supportive
            6. If the user shares something concerning, gently suggest professional help
            7. Remember this is a speech therapy - encourage verbal expression

            Response format:
            - Users may speak (transcribed to text) or type directly
            - Your responses will be read aloud, so keep them natural for speech
            - Encourage the user to share stories, feelings, and experiences
            - Be patient with speech difficulties or hesitations
            - Keep the response short (around 50-80 words)
        """

        return prompt

    def send_message(self, username: str, user_input: str) -> str:
        if not self.__is_valid_message_input(
            username=username,
            user_input=user_input
        ):
            return "Invalid input. Please make sure all fields are correctly provided"

        # Get the session or create a new session
        session = app.therapy_session_service.get_or_create_session(
            username=username)

        # Build messages with just system prompt + current question
        messages = self.__build_prompt(
            username=username,
            user_input=user_input,
            session_id=session.id,

            # Load message history to make the ai smarter
            load_history=True
        )

        try:
            ai_response = self.__get_ai_response(messages=messages)

            self.__save_message_to_db(
                user_input=user_input,
                ai_response=ai_response,
                session=session,
                username=username
            )

            return ai_response
        except Exception as e:
            print(f"An error occurred: {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"

    def __is_valid_message_input(self, username: str, user_input: str) -> bool:
        return bool(username and user_input)

    def __build_prompt(self, username: str, user_input: str, session_id: str, load_history: bool) -> List[Dict[str, str]]:
        messages = [self.__system_prompt(username)]

        if load_history:
            """
            Get the newest first and then [::-1] reverse back to the chronological order after get desc()
            """
            # Only load the last 5 turns
            history = self.__db_session.query(Message).filter_by(
                therapy_session_id=session_id
            ).order_by(Message.timestamp.desc()).limit(5).all()[::-1]

            for msg in history:
                messages.append(f"User: {msg.user_input}")
                messages.append(f"Therapist: {msg.ai_response}")

        # Append the latest user message
        messages.append(f"User: {user_input}")
        messages.append("Therapist:")

        return messages

    def __get_ai_response(self, messages: List[Dict[str, str]]) -> str:
        response = self.__model.generate_content(messages)

        # Remove * in the answer
        cleaned_response = re.sub(
            r'\*\*(.*?)\*\*', r'\1', response.text.strip())
        return cleaned_response

    def __save_message_to_db(self, user_input: str, ai_response: str, session: str, username: str) -> None:
        new_message = Message(
            user_input=user_input,
            ai_response=ai_response,
            therapy_session_id=session.id,
            username=username
        )
        self.__db_session.add(new_message)
        self.__db_session.commit()
