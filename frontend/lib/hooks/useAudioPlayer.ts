// hooks/useAudioPlayer.ts
import { useState, useRef, useCallback } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const releaseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playBase64Audio = useCallback((base64Audio: string) => {
    try {
      releaseAudio();

      // Convert base64 to blob
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => releaseAudio();
      audio.onerror = () => releaseAudio();

      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
      });
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsPlaying(false);
    }
  }, [releaseAudio]);

  const stopAudio = useCallback(() => {
    releaseAudio();
  }, [releaseAudio]);

  return { playBase64Audio, stopAudio, isPlaying };
};
