"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import MessageInput from "../MessageInput";
import { ApiError } from "next/dist/server/api-utils";

import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput, SaveUserInputProps } from "@/lib/api/chat";

interface PromptBoxProps {
  onError: (error: ApiError) => void;
  onRefresh: () => void;
  setIsAILoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PromptBox({
  onError,
  onRefresh,
  setIsAILoading,
}: PromptBoxProps) {
  const [message, setMessage] = useState<string>("");

  // Handle form submission and prevent reload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      onError({
        name: "Error",
        statusCode: 400,
        message: "Please provide a message",
      });
      return;
    }

    // Clear the input fields immediately after the send button is clicked
    const currentTextMessage = message;

    setMessage("");

    setIsAILoading(true);

    // Prepare the data to be sent to the API
    const payload: SaveUserInputProps = {
      content: currentTextMessage,
    };

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      onError({
        name: "Auth Error",
        statusCode: 401,
        message: "You are not authenticated. Please sign in again.",
      });
      return;
    }

    await saveUserInput(token, onError, payload);
    onRefresh();

    if (currentTextMessage) {
      await getAIAnswer(currentTextMessage, onError, token);
      setIsAILoading(false);
    }
    onRefresh();
  };

  return (
    <div className="glass text-[#5e5e5e] px-4 py-3 ">
      <form
        className="flex flex-row gap-4 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <MessageInput textMessage={message} setTextMessage={setMessage} />
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
