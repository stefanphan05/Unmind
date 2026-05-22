from flask import jsonify


class VoiceHandler:
    AVAILABLE_VOICES = {
        "sarah": "af_sarah",
        "heart": "af_heart",
    }

    def __init__(self, voice_generator):
        self.voice_generator = voice_generator

    def handle_switch_voice(self, data):
        """
        Handle switching between different Kokoro voices.

        Expected data format:
        {
            "voice": "sarah" | "heart"
        }
        """
        if not data or "voice" not in data:
            return jsonify({
                "status": "error",
                "message": "Voice parameter is required"
            }), 400

        voice_name = data["voice"].lower()

        if voice_name not in self.AVAILABLE_VOICES:
            return jsonify({
                "status": "error",
                "message": f"Invalid voice. Available voices: {', '.join(self.AVAILABLE_VOICES.keys())}"
            }), 400

        kokoro_voice = self.AVAILABLE_VOICES[voice_name]
        self.voice_generator.set_voice(kokoro_voice)

        return jsonify({
            "status": "success",
            "message": f"Voice switched to {voice_name}",
            "current_voice": voice_name,
            "voice_id": kokoro_voice
        }), 200

    def handle_get_current_voice(self):
        """
        Get the currently active voice.
        """
        current_voice = self.voice_generator.get_voice()

        current_voice_name = None
        for name, kokoro_voice in self.AVAILABLE_VOICES.items():
            if kokoro_voice == current_voice:
                current_voice_name = name
                break

        return jsonify({
            "status": "success",
            "current_voice": current_voice_name or "unknown",
            "voice_id": current_voice,
            "available_voices": list(self.AVAILABLE_VOICES.keys())
        }), 200

    def handle_synthesize(self, data):
        if not data or "text" not in data:
            return jsonify({
                "status": "error",
                "message": "Text parameter is required"
            }), 400

        text = data["text"].strip()
        if not text:
            return jsonify({
                "status": "error",
                "message": "Text cannot be empty"
            }), 400

        return self.voice_generator.synthesize_wav_response(text)
