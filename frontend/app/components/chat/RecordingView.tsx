"use client";

import { useEffect, useState, useRef } from "react";

import { ApiError } from "next/dist/server/api-utils";

import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput } from "@/lib/api/chat";

import { FaMicrophone, FaPause, FaStop } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface RecordingViewProps {
  onError: (error: ApiError) => void;
  setIsAILoading: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: () => void;
}

export default function RecordingView({
  onError,
  setIsAILoading,
  onRefresh,
}: RecordingViewProps) {
  // State variables to manage recording status, completion, and transcript
  const [isRecording, setIsRecording] = useState(false);
  const [isShowingTranscript, setIsShowingTranscript] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [error, setError] = useState<ApiError | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Scroll to the bottom of the transcript container when the transcript changes
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

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
          message: "Please talk something",
        });
        return;
      }

      const currentTranscript = transcript;
      setTranscript("");
      setIsShowingTranscript(false);
      setRecordingComplete(false);

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
        await saveUserInput(token, onError, currentTranscript);
        onRefresh();

        await getAIAnswer(currentTranscript, onError, token);
        onRefresh();

        setIsAILoading(false);
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
  };

  const clearTranscript = () => {
    // Stop the current recognition
    recognitionRef.current.stop();

    // Clear the transcript
    setTranscript("");

    // Restart recognition after a brief delay to avoid conflicts
    setTimeout(() => {
      if (isRecording) {
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

        // Restart the speech recognition
        recognitionRef.current.start();
      }
    }, 100);
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
    <div className="relative h-[calc(100vh-64px)] flex items-center justify-center ">
      {isShowingTranscript && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 mb-10">
          <div
            ref={transcriptContainerRef}
            className="w-96 p-3 bg-black/5 rounded-2xl max-h-40 overflow-y-auto scrollbar-hide"
          >
            <p className="mb-0 text-sm leading-relaxed">
              {transcript || "Listening..."}
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-center">
        {isRecording ? (
          <div className="flex flex-row justify-center items-center">
            {/* Clear transcript button */}
            <button
              onClick={clearTranscript}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-full w-16 h-16 focus:outline-none cursor-pointer transition-colors"
              title="Clear transcript"
            >
              <RxCross2 className="text-gray-600 w-6 h-6" />
            </button>

            {/* Button for stopping recording */}
            <button
              onClick={handleToggleRecording}
              className="flex items-center justify-center bg-red-400 hover:bg-red-500 ring-4 ring-red-300 animate-expand rounded-full w-40 h-40 focus:outline-none cursor-pointer ml-10 mr-10"
            >
              <FaPause className="text-white w-24 h-24" />
            </button>

            {/* Cancel recording button */}
            <button
              onClick={cancelRecording}
              className="flex items-center justify-center bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-full w-16 h-16 focus:outline-none cursor-pointer transition-colors"
              title="Cancel recording"
            >
              <FaStop className="text-red-600 w-6 h-6" />
            </button>
          </div>
        ) : (
          // Button for starting recording
          <button
            onClick={handleToggleRecording}
            className="flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-40 h-40 focus:outline-none cursor-pointer"
          >
            <FaMicrophone className="text-white w-24 h-24" />
          </button>
        )}
      </div>
    </div>
  );
}
