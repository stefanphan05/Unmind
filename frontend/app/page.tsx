"use client";
import { useState } from "react";

import Message from "@/types/message";

import PromptBox from "./components/PromptBox";
import ChatMessage from "./components/ChatMessage";
import TalkingCharacter from "./components/TalkingCharacter";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your AI therapist. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
    {
      id: "2",
      content:
        "Hey! I'm feeling a bit overwhelmed with work and personal life.",
      role: "user",
      timestamp: new Date(),
    },
    {
      id: "3",
      content:
        "It sounds like you're dealing with a lot. It's important to take breaks and prioritize self-care. Have you had any time to relax recently?",
      role: "assistant",
      timestamp: new Date(),
    },
    {
      id: "4",
      content: "Not really, I’ve been working late every day this week.",
      role: "user",
      timestamp: new Date(),
    },
    {
      id: "5",
      content:
        "That sounds tough. It's essential to set boundaries for your mental health. Maybe start by scheduling some small breaks during your workday. Would you like some tips on relaxation techniques?",
      role: "assistant",
      timestamp: new Date(),
    },
    {
      id: "6",
      content: "Yes, that would be helpful. I could really use some guidance.",
      role: "user",
      timestamp: new Date(),
    },
    {
      id: "7",
      content:
        "One simple technique is deep breathing. Try inhaling for four counts, holding for four, and exhaling for four. You can also try journaling to clear your mind. What do you think? Would you like to try one of these?",
      role: "assistant",
      timestamp: new Date(),
    },
    {
      id: "8",
      content:
        "I think I’ll try deep breathing first. Thank you for the suggestion!",
      role: "user",
      timestamp: new Date(),
    },
    {
      id: "9",
      content:
        "You're very welcome! I'm glad you're willing to give it a try. Take your time, and remember to be kind to yourself.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const handleNewMessage = (newMessage: Message): void => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
