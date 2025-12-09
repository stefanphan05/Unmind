"use client";

import React, { useState } from "react";
import { ApiError } from "next/dist/server/api-utils";

import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput } from "@/lib/api/chat";
import { BiSolidSend } from "react-icons/bi";
import { useParams } from "next/navigation";
import MessageInput from "@/components/ui/MessageInput";
import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";

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

  const params = useParams();

  const therapySessionId = Number(params?.therapySessionId);
  const { playBase64Audio, isPlaying } = useAudioPlayer();

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

    await saveUserInput(token, therapySessionId, onError, currentTextMessage);
    onRefresh();

    if (currentTextMessage) {
      const response = await getAIAnswer(
        currentTextMessage,
        therapySessionId,
        onError,
        token
      );
      if (response?.audio) {
        playBase64Audio(response.audio);
      }
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
