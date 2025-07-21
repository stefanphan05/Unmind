"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import Message from "@/types/message";
import { getAIanswer } from "@/lib/api";
import MessageInput from "./MessageInput";
import { ApiError } from "next/dist/server/api-utils";

interface PromptBoxProps {
  onNewMessage: (message: Message) => void;
  onLoadingChange: (isLoading: boolean, loadingType?: "text" | "audio") => void;
  onError: (error: ApiError) => void;
}

export default function PromptBox({
  onNewMessage,
  onLoadingChange,
  onError,
}: PromptBoxProps) {
  const [textMessage, setTextMessage] = useState<string>("");

  // Handle form submission and prevent reload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear the input fields immediately after the send button is clicked
    const currentTextMessage = textMessage;

    setTextMessage("");

    if (textMessage) {
      try {
        await getAIanswer(currentTextMessage, onNewMessage, onError);
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
        <MessageInput
          textMessage={textMessage}
          setTextMessage={setTextMessage}
        />
        <div className="flex gap-2 items-center">
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
}
