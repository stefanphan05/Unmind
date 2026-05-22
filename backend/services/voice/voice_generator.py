import io
from pathlib import Path

import soundfile as sf
from flask import send_file
from kokoro_onnx import Kokoro

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
KOKORO_MODEL_PATH = BACKEND_DIR / "kokoro-v1.0.onnx"
KOKORO_VOICES_PATH = BACKEND_DIR / "voices-v1.0.bin"

DEFAULT_VOICE = "af_sarah"


def create_kokoro() -> Kokoro:
    return Kokoro(str(KOKORO_MODEL_PATH), str(KOKORO_VOICES_PATH))


class VoiceGenerator:
    def __init__(self, kokoro: Kokoro, voice: str = DEFAULT_VOICE):
        self._kokoro = kokoro
        self._voice = voice

    def set_voice(self, voice: str):
        self._voice = voice

    def get_voice(self) -> str:
        return self._voice

    def set_voice_id(self, voice: str):
        self.set_voice(voice)

    def get_voice_id(self) -> str:
        return self.get_voice()

    def _synthesize_to_buffer(self, text: str) -> io.BytesIO:
        samples, sample_rate = self._kokoro.create(
            text,
            voice=self._voice,
            speed=1.0,
            lang="en-us",
        )
        buffer = io.BytesIO()
        sf.write(buffer, samples, sample_rate, format="WAV")
        buffer.seek(0)
        return buffer

    def synthesize_wav_response(self, text: str):
        buffer = self._synthesize_to_buffer(text)
        return send_file(buffer, mimetype="audio/wav")

    def generate_audio(self, text: str) -> bytes | None:
        try:
            buffer = self._synthesize_to_buffer(text)
            return buffer.getvalue()
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None
