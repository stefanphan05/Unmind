import os
import openai
from dotenv import load_dotenv
from models.therapy_session import TherapySession, StatusType
from models.message import Message, InputType


class AITherapistService:
    def __init__(self, db_session):
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in .env")

        self.__client = openai.OpenAI()
        self.__model = "gpt-4o-mini"
        self.__db_session = db_session

    def __system_prompt_settings(self, username: str) -> str:
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
        active_session = self.__db_session.query(TherapySession).filter_by(
            username=username, status=StatusType.ACTIVE).first()

        if active_session:
            return active_session

        # No active session, create one
        new_session = TherapySession(username=username)
        self.__db_session.add(new_session)
        self.__db_session.commit()
        return new_session

    def end_active_session(self, username: str):
        old_session = self.__db_session.query(TherapySession).filter_by(
            username=username, status=StatusType.ACTIVE).first()

        if old_session:

            # Delete related messages
            self.__db_session.query(Message).filter_by(
                therapy_session_id=old_session.id).delete()
            self.__db_session.delete(old_session)
            self.__db_session.commit()

    def send_message(self, username: str, user_input: str, input_type: InputType) -> str:

        # TODO: Check input type, make sure username and user input arent empty

        # Get the session or create a new session
        session = self.get_or_create_session(username)

        # Get all the messages in the current session
        previous_messages = self.db.query(Message).filter_by(
            therapy_session_id=session.id
        ).order_by(Message.timestamp).all()

        messages = [{
            "role": "system",
            "content": self.__self.__system_prompt_settings(username)
        }]

        for message in previous_messages:
            messages.append([
                {"role": "system", "content": message.user_input},
                {"role": "user", "content": message.ai_response}
            ])

        messages.append([
            {"role": "user", "content": user_input},
            {"role": "system", "content": user_input}
        ])

        try:
            # Use the new method to send messages to the OpenAI model
            response = self.__client.chat.completions.create(
                model=self.__model,
                messages=messages
            )

            # Access the response text differently
            ai_response = response.choices[0].message.content.strip()

            # Save new message into database
            new_message = Message(
                user_input=user_input,
                ai_response=ai_response,
                input_type=input_type,
                therapy_session_id=session.id
            )
            self.__db_session.add(new_message)
            self.db.commit()

            return ai_response
        except Exception as e:
            print(f"An error occurred: {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"


# service = AITherapistService(db.session)
# reply = service.send_message(
#     "Stefan", "I've been feeling so stress lately. One of the reason is that i just broke up with my girlfriend a couple of weeks ago")
# print("AI Therapist:", reply)
