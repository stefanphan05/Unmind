import os
from dotenv import load_dotenv
import google.generativeai as genai


class AITherapistService:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env")

        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
        # self.model = genai.GenerativeModel("gemini-2.5-pro")

    def __system_prompt_settings(self, username: str):
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

    def send_message(self, username, user_input):
        prompt = self.__system_prompt_settings(username)
        full_prompt = f"{prompt}\n\nUser: {user_input}\nTherapist:"

        response = self.model.generate_content(full_prompt)
        return response.text.strip()


service = AITherapistService()
reply = service.send_message("Stefan", "I've been feeling overwhelmed lately.")
print("AI Therapist:", reply)
