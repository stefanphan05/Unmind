import speech_recognition as sr


class TextGenerator:
    def __init__(self):
        # Create a speech recognition object
        self.r = sr.Recognizer()

    def speech_to_text(self, path):
        # use te audio file as the audio source
        try:
            with sr.AudioFile(path) as source:
                audio_listened = self.r.record(source)
                # try converting it to text
                text = self.r.recognize_google(audio_listened)

            return text
        except FileNotFoundError:
            return "Error: The audio file was not found."
        except sr.UnknownValueError:
            return "Could not understand the audio. Please try again with clearer recording."
        except Exception as e:
            return f"An unexpected error occurred: {e}"
