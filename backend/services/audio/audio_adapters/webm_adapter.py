import os
import tempfile
from ..audio_processors.audio_processor import AudioProcessor
from ..audio_adaptees.webm_adaptee import WebMAdaptee
from werkzeug.datastructures import FileStorage
from typing import Any, Dict


class WebMAdapter(AudioProcessor):
    """
    Adapter for WebM audio file
    """

    def __init__(self):
        self.webm_processor = WebMAdaptee()

    def process_audio(self, audio_file: FileStorage) -> Dict[str, Any]:
        """Adapt WebM audio to WAV format"""
        temp_webm = None
        temp_wav = None

        try:
            # Save WebM file temporarily
            temp_webm = tempfile.NamedTemporaryFile(
                delete=False, suffix='.webm')
            audio_file.save(temp_webm.name)

            # Create WAV output file
            temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')

            # Convert WebM to WAV
            success = self.webm_processor.covert_webm_to_wav(
                temp_webm.name, temp_wav.name)

            if success:
                return {
                    "success": True,
                    "file_path": temp_wav.name,
                    "format": "wav",
                    "error": None
                }
            else:
                return {
                    "success": False,
                    "error": "WebM to WAV conversion failed"
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"WebM adapter error: {str(e)}"
            }

        finally:
            # Clearn up input file
            if temp_webm and os.path.exists(temp_webm.name):
                os.remove(temp_webm.name)

    def supported_formats(self) -> list:
        return ["webm"]
