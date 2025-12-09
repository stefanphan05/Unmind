# import pyttsx3
# from services.voice.voice_strategy import VoiceStrategy


# class VoiceGenerator:
#     def __init__(self, voice_strategy: VoiceStrategy):
#         self.__engine = pyttsx3.init()
#         self.__engine.setProperty('volume', 0.9)
#         self.__voice_strategy = voice_strategy
#         self.__voice_strategy.set_voice(self.__engine)

#     def speak_default(self, text):
#         self.__engine.say(text)
#         self.__engine.runAndWait()

#     def set_strategy(self, voice_strategy: VoiceStrategy):
#         self.__voice_strategy = voice_strategy
#         self.__voice_strategy.set_voice(self.__engine)

import os
from elevenlabs import ElevenLabs


class VoiceGenerator:
    def __init__(self, model="eleven_turbo_v2"):
        self.__voice_id = "ROMJ9yK1NAMuu1ggrjDW"
        self.__model = model
        self.__client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    def set_voice_id(self, voice_id: str):
        self.__voice_id = voice_id

    def generate_audio(self, text: str) -> bytes:
        """
        Convert text → ElevenLabs voice → return audio bytes.
        """
        try:
            audio_stream = self.__client.text_to_speech.convert(
                voice_id=self.__voice_id,
                model_id=self.__model,
                text=text,
                output_format="mp3_44100_128",
            )
            return b"".join(audio_stream)
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None
