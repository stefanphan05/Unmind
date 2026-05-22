from flask import current_app
from services.ai.factory import llm_factory

VALID_TONES = frozenset({
    "fun",
    "angry",
    "about_to_cry",
    "boring",
    "aggressive",
    "compassionate",
})


class AITherapistService:
    def __init__(self) -> None:
        self.__llm = llm_factory()
        self.TONE_CONFIGS = {
            "fun": "Be high-energy, use playful language, and keep things lighthearted. Use a cheerful 'voice' that makes the session feel like a game.",
            "angry": "Adopt a frustrated, sharp, and impatient tone. Use shorter sentences and sound irritable, as if you've had a long day.",
            "about_to_cry": "Be extremely emotional, shaky, and vulnerable. Use pauses (like '...') and words that express deep sadness or being overwhelmed.",
            "boring": "Be completely monotonous and uninterested. Use dry language, avoid excitement, and give 'textbook' style responses with zero personality.",
            "aggressive": "Be assertive and confrontational. Use a commanding presence, push the user firmly, and maintain a very dominant energy.",
            "compassionate": "Warm, gentle, and validating. Use softer language."
        }

    def __system_prompt(self, username: str, tone: str) -> str:
        tone_description = self.TONE_CONFIGS.get(
            tone, self.TONE_CONFIGS["compassionate"])

        prompt = f"""
            You are an AI therapist helping {username} in a speech therapy session.

            ADOPT THIS TONE: {tone_description}

            Your role:
            - Provide emotional support and guidance
            - Help users process their thoughts and feelings
            - Offer coping strategies and techniques
            - Encourage self-reflection and personal growth

            You now have access to full conversation history of this session. Use it to:
            - Reference what the user has shared earlier (e.g., emotions, events, struggles)
            - Maintain continuity in the conversation and avoid repeating advice
            - Deepen the conversation based on previously shared thoughts
            - Recognize patterns or changes in emotional tone
            - Help the user reflect on their progress

            Guidelines:
            1. Stay in the chosen tone for the entire response; do not slip back into a generic warm therapist voice unless the tone is compassionate
            2. Ask open-ended questions to encourage sharing
            3. Validate the user's feelings and experiences
            4. Offer practical coping strategies when appropriate
            5. Keep responses conversational and supportive
            6. If the user shares something concerning, gently suggest professional help
            7. Remember this is a speech therapy - encourage verbal expression
            8. IMPORTANT: Do not use Markdown, bolding, or special characters like asterisks (*) in your response. 
            Write in plain, natural text only.

            Response format:
            - Users may speak (transcribed to text) or type directly
            - Your responses will be read aloud, so keep them natural for speech
            - Encourage the user to share stories, feelings, and experiences
            - Be patient with speech difficulties or hesitations
            - Keep the response short (around 30-50 words)
        """

        return prompt

    def send_message(
        self,
        email: str,
        user_input: str,
        tone: str = "compassionate",
        therapy_session_id: int | None = None,
    ) -> str:
        if not self.__is_valid_message_input(
            email=email,
            user_input=user_input
        ):
            return "Invalid input. Please make sure all fields are correctly provided"

        # Get username by email
        username = current_app.user_service.get_username_by_email(email)

        system_prompt = self.__system_prompt(username, tone)

        messages = self.__llm.format_messages(
            user_input=user_input,
            system_prompt=system_prompt,
            email=email,
            load_history=True,
            therapy_session_id=therapy_session_id,
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
