"use client";
import { useState } from "react";

import PromptBox from "./components/PromptBox";
import ChatMessage from "./components/ChatMessage";
import LoadingMessage from "./components/LoadingMessage";
import ErrorModal from "./components/modals/ErrorModal";

import Message from "@/types/message";
import { ApiError } from "next/dist/server/api-utils";
import RecordingView from "./components/RecordingView";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your AI therapist. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleNewMessage = (newMessage: Message): void => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (error: ApiError) => {
    setError(error);
    setIsLoading(false);
  };

  const closeErrorModal = () => {
    setError(null);
  };

  return (
    <div>
      <div className="mx-auto p-6 h-screen flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5 flex items-center justify-center">
          <RecordingView
            onNewMessage={handleNewMessage}
            onLoadingChange={handleLoadingChange}
            onError={handleError}
          />
        </div>
        <div className="lg:w-2/5 flex flex-col gap-3">
          <div className="flex flex-1 flex-col glass overflow-y-auto">
            {/* ------Header------ */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-3xl font-semibold text-white">
                Therapy Session
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Un-do the Chaos, Unmind the Peace.
              </p>
            </div>
            <div className="p-4 overflow-y-auto scrollbar-hide">
              {/* ------Messages------ */}
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {/* Loading Message */}
              {isLoading && <LoadingMessage />}
            </div>
          </div>
          <div className="mt-auto">
            <PromptBox
              onNewMessage={handleNewMessage}
              onLoadingChange={handleLoadingChange}
              onError={handleError}
            />
          </div>
        </div>
      </div>
      <ErrorModal error={error} onClose={closeErrorModal} />
    </div>
  );
}
