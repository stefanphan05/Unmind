import os
from elevenlabs import ElevenLabs
from services.voice.voice_strategy import VoiceStrategy


class ElevenLabsVoiceStrategy(VoiceStrategy):
    def __init__(self, voice_id="bIHbv24MWmeRgasZH58o", model="eleven_turbo_v2"):
        self.voice_id = voice_id
        self.model = model
        self.client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    def set_voice(self, engine):
        pass

    def generate_audio(self, text: str):
        """
        Generate and return audio bytes from ElevenLabs.
        """
        audio_stream = self.client.text_to_speech.convert(
            voice_id=self.voice_id,
            model_id=self.model,
            text=text,
            output_format="mp3_44100_128",
        )
        return b"".join(audio_stream)
