"use client";

import React, { useState, useRef } from "react";
import { Send, Mic, Trash2 } from "lucide-react";
import Message from "@/types/message";
import { sendAudioToBackend, sendTextToBackend } from "@/lib/api";
import MessageInput from "./MessageInput";
import AudioRecorder from "./AudioRecorder";

interface PromptBoxProps {
  onNewMessage: (message: Message) => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({ onNewMessage }) => {
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
      await sendAudioToBackend(currentAudioBlob, onNewMessage);
    } else if (textMessage) {
      await sendTextToBackend(currentTextMessage, onNewMessage);
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
