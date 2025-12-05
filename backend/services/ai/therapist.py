from flask import current_app
from services.ai.factory import llm_factory


class AITherapistService:
    def __init__(self) -> None:
        self.__llm = llm_factory()

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
            - Keep the response short (around 30-50 words)
        """

        return prompt

    def send_message(self, email: str, user_input: str) -> str:
        if not self.__is_valid_message_input(
            email=email,
            user_input=user_input
        ):
            return "Invalid input. Please make sure all fields are correctly provided"

        # Get username by email
        username = current_app.user_service.get_username_by_email(email)

        system_prompt = self.__system_prompt(username)

        messages = self.__llm.format_messages(
            user_input=user_input,
            system_prompt=system_prompt,
            email=email,

            # Load message history to make the ai smarter
            load_history=True
        )

        try:
            return self.__get_ai_response(messages=messages)
        except Exception as e:
            print(f"An error occurred: {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"

    def __is_valid_message_input(self, email: str, user_input: str) -> bool:
        return bool(email and user_input)

    def __get_ai_response(self, messages) -> str:
        return self.__llm.generate_response(messages)
