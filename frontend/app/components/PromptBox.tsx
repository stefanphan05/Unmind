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

  const [tempAudioURL, setTempAudioURL] = useState<string | null>(null);
  const [tempAudioBlob, setTempAudioBlob] = useState<Blob | null>(null);
  const [tempTextMessage, setTempTextMessage] = useState<string>("");

  // Handle form submission and prevent reload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (audioURL) {
      setTempAudioURL(audioURL);
      setAudioBlob(audioBlob);
      setAudioURL(null);
      setAudioBlob(null);
      await sendAudioToBackend(tempAudioBlob, onNewMessage);
    } else if (textMessage) {
      setTempTextMessage(textMessage);
      setTextMessage("");
      await sendTextToBackend(tempTextMessage, onNewMessage);
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

          <p
            className="glass flex items-center gap-2 text-sx px-2 py-2 cursor-pointer hover:bg-[#2b2b2b] hover:text-white transition"
            onClick={handleSubmit}
          >
            <Send className="h-5" />
          </p>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;
