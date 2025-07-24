"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/useErrorHandler";

import RecordingView from "../components/chat/RecordingView";
import ChatMessage from "../components/chat/ChatMessage";
import PromptBox from "../components/chat/PromptBox";
import ErrorModal from "../components/modals/ErrorModal";
import TypingIndicator from "../components/chat/TypingIndicator";

import Message from "@/types/message";
import { getAllMessages } from "@/lib/api/chat";
import Header from "../components/layout/Header";

export default function ChatRoute() {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ------------------ States ------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ Auth Check ------------------
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      router.replace("/signin");
      return;
    }

    fetchMessages(token);
  }, [refreshTrigger]);

  const fetchMessages = async (token: string) => {
    try {
      const fetched = await getAllMessages(token, handleError);

      if (fetched) {
        setMessages(fetched);
      }
    } catch (error) {
      handleError({
        name: "Failed to fetch messages",
        statusCode: 400,
        message: "Failed to fetch messages",
      });
    }
  };

  // Scroll to bottom after message updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6 ">
        {/* ---------- Left: Recording Panel ---------- */}
        <div className="lg:w-3/5 flex items-center justify-center">
          <RecordingView
            onError={handleError}
            setIsAILoading={setIsAILoading}
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </div>
        {/* ---------- Right: Chat Panel ---------- */}
        <div className="lg:w-2/5 flex flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col overflow-y-auto scroll-smooth">
            {/* Chat Messages */}
            <div className="p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {/* Loading Message */}
              {isAILoading && <TypingIndicator />}

              <div className="h-30"></div>

              {/* Scroll target */}
              <div ref={messageEndRef} />
            </div>
          </div>

          {/* Prompt Box */}
          <div className="sticky bottom-0 w-full bg-white px-4">
            <PromptBox
              onError={handleError}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
              setIsAILoading={setIsAILoading}
            />
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal error={error} onClose={closeErrorModal} />
    </div>
  );
}
