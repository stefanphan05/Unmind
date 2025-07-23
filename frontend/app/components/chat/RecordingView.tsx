"use client";

import { useEffect, useState, useRef } from "react";

import { ApiError } from "next/dist/server/api-utils";
import { getAIAnswer } from "@/lib/api/ai";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface RecordingViewProps {
  onError: (error: ApiError) => void;
  setIsAILoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RecordingView({
  onError,
  setIsAILoading,
}: RecordingViewProps) {
  // State variables to manage recording status, completion, and transcript
  const [isRecording, setIsRecording] = useState(false);
  const [isShowingTranscript, setIsShowingTranscript] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [error, setError] = useState<ApiError | null>(null);

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Function to start recording
  const startRecording = () => {
    setIsRecording(true);
    setIsShowingTranscript(true);

    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event: any) => {
      let fullTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }

      setTranscript(fullTranscript.trim());
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to stop recording
  const stopRecording = async (e: React.FormEvent) => {
    e.preventDefault();

    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();

      if (!transcript.trim()) {
        onError({
          name: "Error",
          statusCode: 400,
          message: "Please provide a message",
        });
        return;
      }

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

      if (transcript) {
        await getAIAnswer(transcript, onError, token);

        setTranscript("");
        setIsShowingTranscript(false);
        setRecordingComplete(false);
      }
    }
  };

  // Toggle recording state and manage recording actions
  const handleToggleRecording = (e: React.FormEvent) => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording(e);
    }
  };

  return (
    <div className="flex-col">
      {isShowingTranscript && (
        <div className="flex items-center justify-center">
          <div className="max-w-lg p-3 bg-black/5 rounded-2xl">
            <p className="mb-0">{transcript}</p>
          </div>
        </div>
      )}

      <div className="flex items-center">
        {isRecording ? (
          // Button for stopping recording
          <button
            onClick={handleToggleRecording}
            className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 ring-4 ring-red-300 animate-expand rounded-full w-20 h-20 focus:outline-none cursor-pointer"
          >
            <svg
              className="h-12 w-12 "
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
        ) : (
          // Button for starting recording
          <button
            onClick={handleToggleRecording}
            className="mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none cursor-pointer"
          >
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-white"
            >
              <path
                fill="currentColor"
                d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
