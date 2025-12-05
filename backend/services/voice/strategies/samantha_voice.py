from services.voice.voice_strategy import VoiceStrategy


class SamanthaVoiceStrategy(VoiceStrategy):
    def set_voice(self, engine):
        voices = engine.getProperty('voices')

        for voice in voices:
            if "samantha" in voice.name.lower():
                engine.setProperty('voice', voice.id)
                print(f"Using voice: {voice.name}")
                return
        print("Samantha voice not found!")
