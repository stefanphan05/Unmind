from typing import Optional
from .audio_processors.speech_recognition_processor import SpeechRecognitionProcessor, AudioProcessor
from .audio_adapters.webm_adapter import WebMAdapter
from werkzeug.datastructures import FileStorage


class AudioProcessorFactory:
    """
    Factory to create the appropriate audio processor based on file type
    """

    def __init__(self):
        self.adapters = {
            'webm': WebMAdapter(),
            'wav': SpeechRecognitionProcessor()
        }

    def get_processor(self, audio_file: FileStorage) -> Optional[AudioProcessor]:
        """
        Get the appropriate audio processor (adapters) based on file type
        """
        file_type = self.__detect_file_type(audio_file)

        if file_type in self.adapters:
            return self.adapters[file_type]
        else:
            return None

    def __detect_file_type(self, audio_file: FileStorage) -> str:
        """Detect file type based on content and file name"""

        # Reset the file pointer to 0
        audio_file.seek(0)

        try:
            # Get the first 12 bytes
            header = audio_file.read(12)
            audio_file.seek(0)

            if header.startswith(b'RIFF') and b'WAVE' in header:
                return 'wav'
            elif b'webm' in header.lower():
                return 'webm'
        except:
            pass

        if audio_file.filename:
            """
            name = something.wav

            in order to get .wav

            split the name = [something, wav]

            get the [-1] which is wav
            """
            extension = audio_file.filename.lower().split('.')[-1]
            if extension in ['webm', 'ogg', 'mp3', 'm4a', 'wav']:
                return extension

        return 'unknown'
