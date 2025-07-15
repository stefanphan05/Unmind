import speech_recognition as sr

# Create a speech recognition object
r = sr.Recognizer()


def transribe_audio(path):
    # use te audio file as the audio source
    try:
        with sr.AudioFile(path) as source:
            audio_listened = r.record(source)
            # try converting it to text
            text = r.recognize_google(audio_listened)

        return text
    except FileNotFoundError:
        return "Error: The audio file was not found."
    except sr.UnknownValueError:
        return "Could not understand the audio. Please try again with clearer recording."
    except Exception as e:
        return f"An unexpected error occurred: {e}"
