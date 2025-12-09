from flask import jsonify
import base64
from utils.response_helpers import ResponseHelper
from controllers.messages.message_validators import MessageValidator


class MessageHandlers:
    def __init__(self, message_service, ai_therapist, voice_generator):
        self.__message_service = message_service
        self.__ai_therapist = ai_therapist
        self.__voice_generator = voice_generator

    def handle_save_user_input(self, data: dict, email: str, therapy_session_id: int):
        valid, error = MessageValidator.validate_user_input(data)
        if not valid:
            return ResponseHelper.validation_error(error)

        content = data.get("content")

        message = self.__message_service.save_message(
            content=content,
            role="user",
            email=email,
            therapy_session_id=therapy_session_id
        )

        return ResponseHelper.success_response(message.to_dict(), status_code=201)

    def handle_ai_response(self, data: dict, email: str, therapy_session_id: int):
        valid, error = MessageValidator.validate_user_input(data)
        if not valid:
            return ResponseHelper.validation_error(error)

        user_input = data.get("content")

        # Get AI Response
        ai_answer = self.__ai_therapist.send_message(
            email=email,
            user_input=user_input
        )

        message = self.__message_service.save_message(
            content=ai_answer,
            role="assistant",
            email=email,
            therapy_session_id=therapy_session_id
        )

        # # Convert response to voice
        # self.__voice_generator.speak_default(message.content)
        # Generate audio bytes
        audio_bytes = self.__voice_generator.generate_audio(message.content)

        response_data = {
            "question": user_input,
            "answer": message.to_dict()
        }

        # Add audio if generated successfully
        if audio_bytes:
            # Encode audio bytes to base64 for JSON transmission
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            response_data["audio"] = audio_base64

        return ResponseHelper.success_response(response_data)

    def handle_get_all_messages(self, email: str, therapy_session_id: int):
        messages = self.__message_service.get_all_messages(
            email,
            therapy_session_id
        )

        return ResponseHelper.success_response([msg.to_dict() for msg in messages])

    def handle_delete_all_messages(self, email: str, therapy_session_id: int):
        self.__message_service.delete_all_messages(email, therapy_session_id)
        return ResponseHelper.success_response({"message": "All messages deleted successfully"}, status_code=201)
