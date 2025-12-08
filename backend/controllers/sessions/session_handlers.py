from datetime import datetime
from controllers.sessions.session_validators import SessionValidator
from utils.response_helpers import ResponseHelper


class TherapySessionHandlers:
    def __init__(self, session_service):
        self.__session_service = session_service

    def handle_get_all_sessions(self, email: str):
        sessions = self.__session_service.get_all_sessions(
            email)

        return ResponseHelper.success_response([session.to_dict() for session in sessions])

    def handle_session_creation(self, email: str, data: dict):
        # Because if these data can be empty by default so no need to validate
        name = data.get('name', "")
        status = data.get('status', "")
        result = data.get('result', '')

        session = self.__session_service.create_session(
            email=email,
            name=name,
            date=datetime.now(),
            status=status,
            result=result
        )

        return ResponseHelper.success_response(session.to_dict(), status_code=201)

    def handle_update_session(self, email: str, data: dict):
        valid, error = SessionValidator.validate_user_input_for_update(data)
        if not valid:
            return ResponseHelper.validation_error(error)

        id = data.get("id", "")
        name = data.get('name', "")
        status = data.get('status', "")
        result = data.get('result', '')

        updated = self.__session_service.update_session(
            email=email,
            id=id,
            name=name,
            date=datetime.now(),
            status=status,
            result=result,
        )

        if not updated:
            return ResponseHelper.error_response("Session not found", 404)

        return ResponseHelper.success_response(updated.to_dict(), 200)

    def handle_delete_session(self, email: str, data: dict):
        # Validate input
        session_id = data.get("id")
        if not session_id:
            return ResponseHelper.validation_error("Session ID is required")

        # Delete session
        deleted = self.__session_service.delete_session(
            email=email, id=session_id)

        if not deleted:
            return ResponseHelper.error_response("Session not found", 404)

        return ResponseHelper.success_response({"message": "Session deleted successfully"}, 200)
