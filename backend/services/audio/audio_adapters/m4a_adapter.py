import os
import tempfile
from ..audio_processors.audio_processor import AudioProcessor
from ..audio_adaptees.m4a_adaptee import M4AAdaptee
from werkzeug.datastructures import FileStorage
from typing import Any, Dict


class M4AAdapter(AudioProcessor):
    """
    Adapter for M4A audio files (iOS recordings)
    """

    def __init__(self):
        self.m4a_processor = M4AAdaptee()

    def process_audio(self, audio_file: FileStorage) -> Dict[str, Any]:
        """
        Adapt M4A audio to WAV format
        """
        temp_m4a = None
        temp_wav = None

        try:
            # Save M4A file temporarily
            temp_m4a = tempfile.NamedTemporaryFile(delete=False, suffix='.m4a')
            audio_file.save(temp_m4a.name)

            # Create WAV output file
            temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')

            # Convert M4A to WAV
            success = self.m4a_processor.convert_m4a_to_wav(
                temp_m4a.name, temp_wav.name)

            if success:
                return {
                    "success": True,
                    "file_path": temp_wav.name,
                    "format": "wav",
                    "error": None
                }
            else:
                return {"success": False, "error": f"M4A to WAV conversion failed"}

        except Exception as e:
            return {"success": False, "error": f"M4A adapter error: {str(e)}"}

        finally:
            # Clean up input file
            if temp_m4a and os.path.exists(temp_m4a.name):
                os.remove(temp_m4a.name)

    def supported_formats(self) -> list:
        return ["m4a"]
