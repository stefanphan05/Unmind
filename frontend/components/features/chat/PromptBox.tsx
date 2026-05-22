"use client";

import React, { useState } from "react";
import { ApiError } from "next/dist/server/api-utils";

import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput } from "@/lib/api/chat";
import { BiSolidSend } from "react-icons/bi";
import { useParams } from "next/navigation";
import MessageInput from "@/components/ui/MessageInput";
import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";

import Message from "@/types/message";

interface PromptBoxProps {
  onError: (error: ApiError) => void;
  onNewMessage: (message: Message) => void;
  setIsAILoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTone: string;
}

export default function PromptBox({
  onError,
  onNewMessage,
  setIsAILoading,
  selectedTone,
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

    const userMessage: Message = {
      id: Date.now(),
      content: currentTextMessage,
      role: "user",
    };

    // Show the user's message instantly while backend requests run.
    onNewMessage(userMessage);
    setIsAILoading(true);

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      setIsAILoading(false);
      onError({
        name: "Auth Error",
        statusCode: 401,
        message: "You are not authenticated. Please sign in again.",
      });
      return;
    }

    try {
      await saveUserInput(token, therapySessionId, onError, currentTextMessage);

      if (currentTextMessage) {
        const response = await getAIAnswer(
          currentTextMessage,
          therapySessionId,
          onError,
          token,
          selectedTone
        );
        if (!response?.answer) {
          return;
        }

        if (response?.audio) {
          playBase64Audio(response.audio);
        }

        const aiMessage: Message = {
          id: Date.now(),
          content: response.answer.content,
          role: "assistant",
          shouldAnimate: true,
        };

        onNewMessage(aiMessage);
      }
    } finally {
      setIsAILoading(false);
    }
  };

  const canSend = message.trim().length > 0;

  return (
    <div className="chat-input-tray">
      <form
        className="chat-input-tray__form"
        onSubmit={handleSubmit}
      >
        <MessageInput textMessage={message} setTextMessage={setMessage} />
        <button
          type="submit"
          className={`chat-send-btn ${canSend ? "" : "chat-send-btn--disabled"}`}
          disabled={!canSend}
          aria-label="Send message"
        >
          <BiSolidSend />
        </button>
      </form>
    </div>
  );
}
