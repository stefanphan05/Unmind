from . import app


def process_audio_with_adapter(audio_file) -> str:
    """
    Process audio using adapter pattern
    """
    try:
        result = app.audio_service.process_audio_file(audio_file)

        print(result)

        if not result["success"]:
            return {"error": result["error"]}

        # Use the converted WAV file for speech recognition
        wav_file_path = result["file_path"]

        print(wav_file_path)

        try:
            # Convert speech to text
            user_input = app.text_generator.speech_to_text(wav_file_path)

            # Check if speech recognition was successul
            if not user_input["sucess"]:
                return {"error": user_input["error"]}

            return {"input": user_input["input"]}

        finally:
            # Clean up temporary WAV file
            app.audio_service.cleanup_temp_file(wav_file_path)

    except Exception as e:
        return {"error": f"Audio processing failed: {str(e)}"}
