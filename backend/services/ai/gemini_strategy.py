# from dotenv import load_dotenv
# import google.generativeai as genai
# import os
# import re
# from .base_llm import LLMStrategy
# from models.message import Message


# class GeminiStrategy(LLMStrategy):
#     def __init__(self):
#         load_dotenv()
#         genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
#         self.__model = genai.GenerativeModel("gemini-2.5-flash")

#     def format_messages(self, username: str, user_input: str, session_id: str, load_history: bool) -> any:
#         """
#         Convert OpenAI-style messages into a single prompt string
#         """
#         messages = [
#             {"role": "system", "content": self.__system_prompt(username)}
#         ]

#         if load_history:
#             """
#             Get the newest first and then [::-1] reverse back to the chronological order after get desc()
#             """
#             # Only load the last 5 turns
#             history = self.__db.query(Message).filter_by(
#                 therapy_session_id=session_id
#             ).order_by(Message.timestamp.desc()).limit(5).all()[::-1]

#             for msg in history:
#                 messages.append(
#                     {"role": "user", "content": msg.user_input}
#                 )

#                 messages.append(
#                     {"role": "assistant", "content": msg.ai_response}
#                 )

#         # Append the latest user message
#         messages.append({"role": "user", "content": user_input})

#         return messages

#     def generate_response(self, prompt: str) -> str:
#         response = self.__model.generate_content(prompt)
#         return re.sub(r'\*{1,2}(.*?)\*{1,2}', r'\1', response.text.strip())
