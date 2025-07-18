"use client";
import { useState } from "react";

import Message from "@/types/message";

import PromptBox from "./components/PromptBox";
import ChatMessage from "./components/ChatMessage";
import TalkingCharacter from "./components/TalkingCharacter";
import LoadingMessage from "./components/LoadingMessage";

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
  const [loadingType, setLoadingType] = useState<
    "text" | "audio" | undefined
  >();
  const [isAudioProcessing, setIsAudioProcessing] = useState(false);

  const handleNewMessage = (newMessage: Message): void => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleLoadingChange = (loading: boolean, type?: "text" | "audio") => {
    setIsLoading(loading);
    setLoadingType(type);
  };

  const handleAudioProcessingChange = (processing: boolean) => {
    setIsAudioProcessing(processing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5 flex flex-col">
          <div className="flex flex-1 flex-col p-5 items-center justify-center">
            <TalkingCharacter isTalking={true} />
          </div>
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
              {(isLoading || isAudioProcessing) && (
                <LoadingMessage
                  loadingType={loadingType}
                  isAudioProcessing={isAudioProcessing}
                />
              )}
            </div>
          </div>
          <div className="mt-auto">
            <PromptBox
              onNewMessage={handleNewMessage}
              onLoadingChange={handleLoadingChange}
              onAudioProcessingChange={handleAudioProcessingChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
