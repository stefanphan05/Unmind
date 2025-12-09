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

import simpleaudio as sa
import io
from pydub import AudioSegment
from services.voice.voice_strategy import VoiceStrategy


class VoiceGenerator:
    def __init__(self, voice_strategy: VoiceStrategy):
        self.__voice_strategy = voice_strategy

    def set_strategy(self, voice_strategy: VoiceStrategy):
        self.__voice_strategy = voice_strategy

    def generate_audio(self, text: str) -> bytes:
        """
        Convert text → ElevenLabs voice → return audio bytes.
        """
        try:
            audio_bytes = self.__voice_strategy.generate_audio(text)
            return audio_bytes
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None

    # def speak_default(self, text: str):
    #     """
    #     Convert text → ElevenLabs voice → play immediately.
    #     """
    #     try:
    #         # 1. Generate audio bytes from ElevenLabs
    #         audio_bytes = self.__voice_strategy.generate_audio(text)

    #         # 2. Use pydub to properly parse the audio format
    #         audio = AudioSegment.from_file(
    #             io.BytesIO(audio_bytes), format="mp3")

    #         # 3. Convert to raw audio data with known parameters
    #         raw_data = audio.raw_data
    #         sample_rate = audio.frame_rate
    #         num_channels = audio.channels
    #         bytes_per_sample = audio.sample_width

    #         # 4. Play with correct parameters
    #         play_obj = sa.play_buffer(
    #             raw_data,
    #             num_channels,
    #             bytes_per_sample,
    #             sample_rate
    #         )
    #         play_obj.wait_done()

    #     except Exception as e:
    #         print(f"Error playing audio: {e}")
