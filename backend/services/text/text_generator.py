from typing import Any, Dict
import speech_recognition as sr


class TextGenerator:
    def __init__(self):
        # Create a speech recognition object
        self.r = sr.Recognizer()

    def speech_to_text(self, path) -> Dict[str, Any]:
        # use te audio file as the audio source
        try:
            with sr.AudioFile(path) as source:
                audio_listened = self.r.record(source)
                # try converting it to text
                text = self.r.recognize_google(audio_listened)

            return {
                "success": True,
                "input": text,
                "error": None
            }
        except FileNotFoundError:
            return {
                "success": False,
                "error": "The audio file was not found."
            }
        except sr.UnknownValueError:
            return {
                "success": False,
                "error": "Could not understand the audio. Please try again with clearer recording."
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"An unexpected error occurred: {e}"
            }
