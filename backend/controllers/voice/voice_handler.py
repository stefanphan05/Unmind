from flask import jsonify


class VoiceHandler:
    # Available voices with their ElevenLabs IDs
    AVAILABLE_VOICES = {
        "rachel": "ROMJ9yK1NAMuu1ggrjDW",
        "adam": "pNInz6obpgDQGcFmaJgB",
        "stefan": "jccKWdITZiywXGZfLmCo",
    }

    def __init__(self, voice_generator):
        self.voice_generator = voice_generator

    def handle_switch_voice(self, data):
        """
        Handle switching between different voices by changing the voice_id.

        Expected data format:
        {
            "voice": "rachel" | "adam" | "stefan"
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

        # Get the voice ID and set it
        voice_id = self.AVAILABLE_VOICES[voice_name]

        # Access the strategy and change its voice_id
        self.voice_generator.set_voice_id(voice_id)

        return jsonify({
            "status": "success",
            "message": f"Voice switched to {voice_name}",
            "current_voice": voice_name,
            "voice_id": voice_id
        }), 200

    def handle_get_current_voice(self):
        """
        Get the currently active voice.
        """
        current_voice_id = self.voice_generator._VoiceGenerator__voice_strategy.voice_id

        # Find the voice name by ID
        current_voice_name = None
        for name, vid in self.AVAILABLE_VOICES.items():
            if vid == current_voice_id:
                current_voice_name = name
                break

        return jsonify({
            "status": "success",
            "current_voice": current_voice_name or "unknown",
            "voice_id": current_voice_id,
            "available_voices": list(self.AVAILABLE_VOICES.keys())
        }), 200
