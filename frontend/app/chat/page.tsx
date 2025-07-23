"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/useErrorHandler";

import RecordingView from "../components/RecordingView";
import ChatMessage from "../components/ChatMessage";
import PromptBox from "../components/PromptBox";
import ErrorModal from "../components/modals/ErrorModal";
import TypingIndicator from "../components/chat/TypingIndicator";

import Message from "@/types/message";

export default function ChatRoute() {
  const router = useRouter();

  // ------------------ States ------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ Auth Check ------------------
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      router.replace("/signin");
      return;
    }
  }, []);

  return (
    <div>
      <div className="mx-auto p-6 h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6">
        {/* ---------- Left: Recording Panel ---------- */}
        <div className="lg:w-3/5 flex items-center justify-center">
          <RecordingView onError={handleError} />
        </div>
        {/* ---------- Right: Chat Panel ---------- */}
        <div className="lg:w-2/5 flex flex-col gap-3">
          <div className="flex flex-1 flex-col glass overflow-y-auto">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-3xl font-semibold text-white">
                Therapy Session
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="p-4 overflow-y-auto scrollbar-hide">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {/* Loading Message */}
              {isLoading && <TypingIndicator />}
            </div>
          </div>

          {/* Prompt Box */}
          <div className="mt-auto">
            <PromptBox onError={handleError} />
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal error={error} onClose={closeErrorModal} />
    </div>
  );
}
