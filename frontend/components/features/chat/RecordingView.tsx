"use client";

import { useEffect, useState, useRef } from "react";
import { ApiError } from "next/dist/server/api-utils";
import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput } from "@/lib/api/chat";
import { FaMicrophone, FaPause, FaStop } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "next/navigation";
import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";
import Message from "@/types/message";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface RecordingViewProps {
  onError: (error: ApiError) => void;
  setIsAILoading: React.Dispatch<React.SetStateAction<boolean>>;
  onNewMessage: (message: Message) => void;
  selectedTone: string;
}

export default function RecordingView({
  onError,
  setIsAILoading,
  onNewMessage,
  selectedTone,
}: RecordingViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isShowingTranscript, setIsShowingTranscript] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Track the starting index for transcript
  const transcriptStartIndexRef = useRef(0);

  const params = useParams();
  const therapySessionId = Number(params?.therapySessionId);
  const { playBase64Audio, isPlaying } = useAudioPlayer();

  const [error, setError] = useState<ApiError | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Function to start recording with improved configuration
  const startRecording = () => {
    setIsRecording(true);
    setIsShowingTranscript(true);
    transcriptStartIndexRef.current = 0;

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.lang = "en-US";

    recognitionRef.current.maxAlternatives = 1;

    // IMPROVED: Better result handling - only capture new speech after clear
    recognitionRef.current.onresult = (event: any) => {
      let newTranscript = "";

      // Only process results from the starting index onwards
      for (
        let i = transcriptStartIndexRef.current;
        i < event.results.length;
        i++
      ) {
        newTranscript += event.results[i][0].transcript;
      }

      setTranscript(newTranscript.trim());
    };

    // IMPROVED: Error handling
    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        // Don't stop, just continue listening
        return;
      }

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        onError({
          name: "Permission Error",
          statusCode: 403,
          message:
            "Microphone access denied. Please enable microphone permissions.",
        });
        setIsRecording(false);
        setIsShowingTranscript(false);
      } else if (event.error === "network") {
        onError({
          name: "Network Error",
          statusCode: 500,
          message: "Network error occurred. Please check your connection.",
        });
      }
    };

    // IMPROVED: Handle recognition end and auto-restart
    recognitionRef.current.onend = () => {
      // Auto-restart if still recording (handles browser auto-stop)
      if (isRecording) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
        }
      }
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      onError({
        name: "Error",
        statusCode: 500,
        message: "Failed to start speech recognition. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const stopRecording = async (e: React.FormEvent) => {
    e.preventDefault();

    if (recognitionRef.current) {
      recognitionRef.current.stop();

      if (!transcript.trim()) {
        onError({
          name: "Error",
          statusCode: 400,
          message: "Please talk something",
        });
        setIsRecording(false);
        setIsShowingTranscript(false);
        return;
      }

      const currentTranscript = transcript;
      setTranscript("");
      setIsShowingTranscript(false);
      setRecordingComplete(false);
      setIsRecording(false);
      transcriptStartIndexRef.current = 0;

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        onError({
          name: "Auth Error",
          statusCode: 401,
          message: "You are not authenticated. Please sign in again.",
        });
        return;
      }

      setIsAILoading(true);

      if (currentTranscript) {
        await saveUserInput(
          token,
          therapySessionId,
          onError,
          currentTranscript
        );

        const userMessage: Message = {
          id: Date.now(),
          content: currentTranscript,
          role: "user",
        };

        onNewMessage(userMessage);

        const response = await getAIAnswer(
          currentTranscript,
          therapySessionId,
          onError,
          token,
          selectedTone
        );

        if (!response?.answer) {
          setIsAILoading(false);
          return;
        }

        if (response?.audio) {
          playBase64Audio(response.audio);
        }

        setIsAILoading(false);

        const aiMessage: Message = {
          id: Date.now(),
          content: response.answer.content,
          role: "assistant",
          shouldAnimate: true,
        };

        onNewMessage(aiMessage);
      }
    }
  };

  const cancelRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setTranscript("");
    setIsShowingTranscript(false);
    setRecordingComplete(false);
    transcriptStartIndexRef.current = 0;
  };

  // IMPROVED: Clear transcript without stopping recognition
  const clearTranscript = () => {
    if (!recognitionRef.current) return;

    // Clear the displayed transcript
    setTranscript("");

    // IMPORTANT: Update the starting index to ignore previous results
    // This ensures only new speech is captured
    recognitionRef.current.abort(); // Abort current recognition

    // Restart with fresh state
    setTimeout(() => {
      if (isRecording) {
        transcriptStartIndexRef.current = 0;
        startRecording();
      }
    }, 100);
  };

  const handleToggleRecording = (e: React.FormEvent) => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording(e);
    }
  };

  return (
    <div className="chat-voice-panel">
      {isShowingTranscript && transcript && (
        <div
          ref={transcriptContainerRef}
          className="chat-transcript scrollbar-hide"
        >
          <p>{transcript}</p>
        </div>
      )}

      <div className="chat-voice-panel__controls">
        {isRecording ? (
          <>
            <button
              onClick={clearTranscript}
              className="chat-mic-secondary"
              title="Clear transcript"
              type="button"
            >
              <RxCross2 className="h-5 w-5" />
            </button>

            <button
              onClick={handleToggleRecording}
              className="chat-mic-btn chat-mic-btn--recording"
              type="button"
            >
              <FaPause className="chat-mic-btn__icon" />
            </button>

            <button
              onClick={cancelRecording}
              className="chat-mic-secondary chat-mic-secondary--cancel"
              title="Cancel recording"
              type="button"
            >
              <FaStop className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleToggleRecording}
            className="chat-mic-btn"
            type="button"
          >
            <FaMicrophone className="chat-mic-btn__icon" />
          </button>
        )}
      </div>

      {isRecording && (
        <div className="chat-voice-waveform" aria-hidden="true">
          <span className="chat-voice-waveform__bar" />
          <span className="chat-voice-waveform__bar" />
          <span className="chat-voice-waveform__bar" />
          <span className="chat-voice-waveform__bar" />
          <span className="chat-voice-waveform__bar" />
        </div>
      )}

      <p className="chat-voice-panel__label">
        {isRecording ? "Listening..." : "Tap to speak"}
      </p>
    </div>
  );
}
