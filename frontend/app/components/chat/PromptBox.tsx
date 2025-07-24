"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import MessageInput from "../MessageInput";
import { ApiError } from "next/dist/server/api-utils";

import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput } from "@/lib/api/chat";
import { IoSendSharp } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { BiSolidSend } from "react-icons/bi";

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

    await saveUserInput(token, onError, currentTextMessage);
    onRefresh();

    if (currentTextMessage) {
      await getAIAnswer(currentTextMessage, onError, token);
      setIsAILoading(false);
    }
    onRefresh();
  };

  return (
    <div className="bg-gray-100 rounded-4xl text-[#5e5e5e] px-4 py-1 border border-gray-300 sticky bottom-0 w-full">
      <form
        className="flex flex-row gap-4 items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <MessageInput textMessage={message} setTextMessage={setMessage} />
        <div className="flex gap-2 items-center">
          <button
            className="flex items-center gap-2 text-sx px-2 py-2 cursor-pointer hover:bg-gray-300 hover:text-black bg-gray-200 rounded-2xl transition"
            onClick={handleSubmit}
          >
            <BiSolidSend className="h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
