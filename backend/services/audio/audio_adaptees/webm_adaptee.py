import subprocess


class WebMAdaptee:
    """Handle WebM audio from MediaRecorder API"""

    def covert_webm_to_wav(self, webm_path: str, wav_path: str) -> bool:
        """Convert WebM to WAV using FFmpeg"""
        try:
            result = subprocess.run([
                'ffmpeg', '-i', webm_path,
                '-acodec', 'pcm_s16le',
                '-ar', '16000',
                '-ac', '1',
                wav_path, '-y'
            ], capture_output=True, text=True)

            return result.returncode == 0
        except Exception:
            return False
