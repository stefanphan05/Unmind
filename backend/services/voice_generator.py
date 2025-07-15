import pyttsx3


class VoiceGenerator:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 190)
        self.engine.setProperty('volume', 0.9)

        # Set voice to Samantha explicitly
        self.set_voice("Samantha")

    def set_voice(self, target_name):
        # Get all voices
        voices = self.engine.getProperty('voices')

        for voice in voices:
            if target_name.lower() in voice.name.lower():
                self.engine.setProperty('voice', voice.id)
                print(f"Using voice: {voice.name}")
                return

        print(f"{target_name} not found!")

    def speak_default(self, text):
        self.engine.say(text)
        self.engine.runAndWait()


# voice_gen = VoiceGenerator()
# voice_gen.speak_default("Hello, I'm speaking in a normal adult male voice")

# Get all the system voices
# for i, voice in enumerate(voices):
#     print(f"{i}: {voice.name} | ID: {voice.id} | Langs: {voice.languages}")
