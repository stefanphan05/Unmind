"use client";
import { useState } from "react";

import Message from "@/types/message";

import PromptBox from "./components/PromptBox";
import ChatMessage from "./components/ChatMessage";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm here to listen and support you. How are you feeling today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const handleNewMessage = (newMessage: Message): void => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col"></div>
        <div className="lg:w-1/2 flex flex-col gap-3">
          <div className="flex flex-1 flex-col bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-lg text-[#675f5f] overflow-y-auto">
            {/* ------Header------ */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Therapy Session
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Safe space for open conversation
              </p>
            </div>
            <div className="p-4 overflow-y-auto">
              {/* ------Messages------ */}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </div>
          <div className="mt-auto">
            <PromptBox onNewMessage={handleNewMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
