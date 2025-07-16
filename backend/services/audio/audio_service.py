import os
from werkzeug.datastructures import FileStorage
from typing import Any, Dict
from .audio_factory import AudioProcessorFactory


class AudioProcessingService:
    """
    Handle audio process using adapter pattern and factory
    """

    def __init__(self):
        self.factory = AudioProcessorFactory()

    def process_audio_file(self, audio_file: FileStorage) -> Dict[str, Any]:
        """
        Process audio file using appropriate adapter
        """
        try:
            # Get appropriate adapter
            processor = self.factory.get_processor(audio_file)

            if not processor:
                return {
                    "success": False,
                    "error": "Unsupported audio format"
                }

            # Process the audio
            result = processor.process_audio(audio_file)

            return result

        except Exception as e:
            return {
                "success": False,
                "error": f"Audio processing failed stefan: {str(e)}"
            }

    def get_supported_formats(self) -> list:
        """
        Get list of supported audio formats
        """
        return self.factory.supported_formats()

    def cleanup_temp_file(self, file_path: str):
        """
        Clean up temporary files
        """
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)

        except Exception:
            pass
