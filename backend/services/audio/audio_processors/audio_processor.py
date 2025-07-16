from abc import ABC, abstractmethod
from werkzeug.datastructures import FileStorage
from typing import Any, Dict


class AudioProcessor(ABC):
    """
    Abstract base class for audio processing
    """

    @abstractmethod
    def process_audio(self, audio_file: FileStorage) -> Dict[str, Any]:
        """
        Process audio file and return result

        Returns:
            {
                "success": bool,
                "file_path": str,
                "error": str
            }
        """
        pass

    @abstractmethod
    def supported_formats(self) -> list:
        """
        Return list of supported audio formats
        """
        pass
