"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import Message from "@/types/message";
import { sendAudioToBackend, sendTextToBackend } from "@/lib/api";
import MessageInput from "./MessageInput";
import AudioRecorder from "./AudioRecorder";
import { ApiError } from "next/dist/server/api-utils";

interface PromptBoxProps {
  onNewMessage: (message: Message) => void;
  onLoadingChange: (isLoading: boolean, loadingType?: "text" | "audio") => void;
  onAudioProcessingChange: (isProcessing: boolean) => void;
  onError: (error: ApiError) => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({
  onNewMessage,
  onLoadingChange,
  onAudioProcessingChange,
  onError,
}) => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [textMessage, setTextMessage] = useState<string>("");

  // Handle form submission and prevent reload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear the input fields immediately after the send button is clicked
    const currentTextMessage = textMessage;
    const currentAudioBlob = audioBlob;

    setTextMessage("");
    setAudioURL(null);
    setAudioBlob(null);

    if (audioURL) {
      // First show audio processing
      onAudioProcessingChange(true);

      // Simulate audio processing time (1.5 seconds)
      setTimeout(async () => {
        onAudioProcessingChange(false);
        // Then show thinking loading
        onLoadingChange(true, "text");

        try {
          await sendAudioToBackend(currentAudioBlob, onNewMessage, onError);
        } finally {
          onLoadingChange(false);
        }
      }, 1500);
    } else if (textMessage) {
      onLoadingChange(true, "text");
      try {
        await sendTextToBackend(currentTextMessage, onNewMessage, onError);
      } finally {
        onLoadingChange(false);
      }
    }
  };

  return (
    <div className="glass text-[#5e5e5e] px-4 py-3 ">
      <form
        className="flex flex-row gap-4 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        {audioURL ? (
          <audio controls className="flex-1 h-10">
            <source src={audioURL} type={audioBlob?.type || "audio/webm"} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <MessageInput
            textMessage={textMessage}
            setTextMessage={setTextMessage}
          />
        )}

        <div className="flex gap-2 items-center">
          <AudioRecorder
            audioURL={audioURL}
            setAudioURL={setAudioURL}
            setAudioBlob={setAudioBlob}
          />

          <button
            className="glass flex items-center gap-2 text-sx px-2 py-2 cursor-pointer hover:bg-[#2b2b2b] hover:text-white transition"
            onClick={handleSubmit}
          >
            <Send className="h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;
