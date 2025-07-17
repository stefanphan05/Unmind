import os
import openai
from dotenv import load_dotenv

from typing import Dict, List

from models.therapy_session import TherapySession, StatusType
from models.message import Message, InputType


class AITherapistService:
    def __init__(self, db_session) -> None:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in .env")

        self.__client = openai.OpenAI()
        self.__model = "gpt-4o-mini"
        self.__db_session = db_session

    def __system_prompt(self, username: str) -> str:
        prompt = f"""
            You are an AI therapist helping {username} in a speech therapy session.

            Your role:
            - Provide emotional support and guidance
            - Help users process their thoughts and feelings
            - Offer coping strategies and techniques
            - Encourage self-reflection and personal growth

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
        """

        return prompt

    def get_or_create_session(self, username: str) -> TherapySession:
        session = self.__db_session.query(TherapySession).filter_by(
            username=username, status=StatusType.ACTIVE).first()

        if session:
            return session

        # No active session, create one
        new_session = TherapySession(username=username)
        self.__db_session.add(new_session)
        self.__db_session.commit()
        return new_session

    def end_active_session(self, username: str) -> None:
        session = self.__db_session.query(TherapySession).filter_by(
            username=username, status=StatusType.ACTIVE).first()

        if session:
            # Delete related messages
            self.__db_session.query(Message).filter_by(
                therapy_session_id=session.id).delete()
            self.__db_session.delete(session)
            self.__db_session.commit()

    def send_message(self, username: str, user_input: str, input_type: InputType) -> str:
        if not self.__is_valid_message_input(username, user_input, input_type):
            return "Invalid input. Please make sure all fields are correctly provided"

        # Get the session or create a new session
        session = self.get_or_create_session(username)

        # Build messages with just system prompt + current question
        messages = self.__build_openai_messages(username, user_input)

        try:
            ai_response = self.__get_ai_response(messages=messages)

            self.__save_message_to_db(
                user_input=user_input,
                ai_response=ai_response,
                input_type=input_type,
                session=session,
                username=username
            )

            return ai_response
        except Exception as e:
            print(f"An error occurred: {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"

    def __is_valid_message_input(self, username: str, user_input: str, input_type: InputType) -> bool:
        return bool(username or user_input or isinstance(input_type, InputType))

    def __build_openai_messages(self, username: str, user_input: str) -> List[Dict[str, str]]:
        return [
            {
                "role": "system",
                "content": self.__system_prompt(username)
            },
            {
                "role": "user",
                "content": user_input
            }
        ]

    def __get_ai_response(self, messages: List[Dict[str, str]]) -> str:
        response = self.__client.chat.completions.create(
            model=self.__model,
            messages=messages,

            # Limit how long the AI's reply can be (200-300 words)
            max_tokens=300,

            # Controls the creativity or randomness of the response
            temperature=0.7
        )

        # Access the response text differently
        return response.choices[0].message.content.strip()

    def __save_message_to_db(self, user_input: str, ai_response: str, input_type: str, session: str, username: str) -> None:
        new_message = Message(
            user_input=user_input,
            ai_response=ai_response,
            input_type=input_type,
            therapy_session_id=session.id,
            username=username
        )
        self.__db_session.add(new_message)
        self.__db_session.commit()
