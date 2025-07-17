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
    {
      id: "2",
      content:
        "Hello! I'm here to listen and support you. How are you feeling today?",
      role: "user",
      timestamp: new Date(),
    },
    {
      id: "3",
      content:
        "Hello! I'm here to listen and support you. How are you feeling today?Hello! I'm here to listen and support you. How are you feeling today?Hello! I'm here to listen and support you. How are you feeling today?Hello! I'm here to listen and support you. How are you feeling today?",
      role: "user",
      timestamp: new Date(),
    },
  ]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 p-5 bmin-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div></div>
      <div className="flex flex-col gap-3">
        <div className="flex-1/2 flex flex-col bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-lg text-[#675f5f] overflow-y-auto">
          {/* ------Header------ */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Therapy Session
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Safe space for open conversation
            </p>
          </div>
          <div className="p-4">
            {/* ------Messages------ */}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <PromptBox />
        </div>
      </div>
    </div>
  );
}
