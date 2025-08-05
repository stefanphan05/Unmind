from utils.response_helpers import ResponseHelper


class TherapySessionHandlers:
    def __init__(self, session_service):
        self.__session_service = session_service

    def handle_get_all_sessions(self, email: str):
        sessions = self.__session_service.get_all_sessions(
            email)

        return ResponseHelper.success_response([session.to_dict() for session in sessions])

    def handle_session_creation(self, email: str):
        session = self.__session_service.create_session(email)

        return ResponseHelper.success_response(session.to_dict(), status_code=201)
