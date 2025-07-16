from .audio_processor import AudioProcessor
from werkzeug.datastructures import FileStorage
from typing import Any, Dict
import tempfile


class SpeechRecognitionProcessor(AudioProcessor):
    """
    The target interface that speech recognition expects
    """

    def process_audio(self, audio_file: FileStorage) -> Dict[str, Any]:
        """
        Process audio (it's already in correct WAV format)
        """
        try:
            # Create temporary file for WAV
            temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            audio_file.save(temp_wav.name)

            # Validate it's actually a WAV file
            if not self.__is_valid_wav(temp_wav.name):
                return {
                    "success": False,
                    "error": "Invalid WAV format"
                }

            return {
                "sucess": True,
                "file_path": temp_wav.name,
                "format": "wav",
                "error": None
            }

        except Exception as e:
            return {
                "sucess": False,
                "error": f"WAV processing failed: {str(e)}"
            }

    def supported_formats(self) -> list:
        return ["wav"]

    def __is_valid_wav(self, file_path: str) -> bool:
        """Validate WAV file format"""
        try:
            with open(file_path, 'rb') as f:
                """
                Because the WAV file format has a specific structure. 
                The first 12 bytes is header contain key information that identifies
                the file type. It usually contains ASCII characters "RIFF" and "WAVE"
                """
                header = f.read(12)
                return header.startswith(b'RIFF') and b'WAVE' in header

        except:
            return False
