import subprocess


class M4AAdaptee:
    """
    Handles M4A audio files (common on iOS)
    """

    def convert_m4a_to_wav(self, m4a_path: str, wav_path: str) -> bool:
        """Convert M4A to WAV using FFmpeg"""
        try:
            result = subprocess.run([
                'ffmpeg', '-i', m4a_path,
                '-acodec', 'pcm_s16le',
                '-ar', '16000',
                '-ac', '1',
                wav_path, '-y'
            ], capture_output=True, text=True)

            return result.returncode == 0
        except Exception:
            return False
