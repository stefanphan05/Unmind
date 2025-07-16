from . import VoiceStrategy


class DanielVoiceStrategy(VoiceStrategy):
    def set_voice(self, engine):
        voices = engine.getProperty('voices')

        for voice in voices:
            if "daniel" in voice.name.lower():
                engine.setProperty('voice', voice.id)
                print(f"Using voice: {voice.name}")
                return
        print("Daniel voice not found!")
