import pyttsx3
from services.voice.voice_strategy import VoiceStrategy


class VoiceGenerator:
    def __init__(self, voice_strategy: VoiceStrategy):
        self.__engine = pyttsx3.init()
        self.__engine.setProperty('volume', 0.9)
        self.__voice_strategy = voice_strategy
        self.__voice_strategy.set_voice(self.__engine)

    def speak_default(self, text):
        self.__engine.say(text)
        self.__engine.runAndWait()

    def set_strategy(self, voice_strategy: VoiceStrategy):
        self.__voice_strategy = voice_strategy
        self.__voice_strategy.set_voice(self.__engine)
