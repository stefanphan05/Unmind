import os
from dotenv import load_dotenv
import openai


class AITherapistService:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in .env")

        # Create an OpenAI client instance
        self.client = openai.OpenAI()

        self.model = "gpt-4o-mini"

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
        system_prompt = self.__system_prompt_settings(username)

        # Prepare the messages list, which is how OpenAI handles context
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]

        try:
            # Use the new method to send messages to the OpenAI model
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )

            # Access the response text differently
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"An error occurred: {e}")
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment"


# service = AITherapistService()
# reply = service.send_message(
#     "Stefan", "I've been feeling so stress lately. One of the reason is that i just broke up with my girlfriend a couple of weeks ago")
# print("AI Therapist:", reply)
