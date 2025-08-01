from flask import jsonify
from typing import Any, Tuple


class ResponseHelper:
    @staticmethod
    def success_response(data: Any = None, message: str = None, status_code: int = 200):
        response_data = {}
        if data:
            response_data.update(data)

        if message:
            response_data["message"] = message

        return jsonify(response_data), status_code

    @staticmethod
    def error_response(message: str, status_code: int = 400):
        return jsonify({"message": message}), status_code

    @staticmethod
    def validation_error(message: str):
        return jsonify({"message": message}), 400

    @staticmethod
    def unauthorized_error(message: str = "Unauthorized"):
        return ResponseHelper.error_response(message, 401)

    @staticmethod
    def not_found_error(message: str = "Resource not found"):
        return ResponseHelper.error_response(message, 404)
