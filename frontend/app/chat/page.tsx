"use client";
import Message from "@/types/message";
import { useEffect, useState } from "react";
import RecordingView from "../components/RecordingView";
import ChatMessage from "../components/ChatMessage";
import LoadingMessage from "../components/LoadingMessage";
import PromptBox from "../components/PromptBox";
import ErrorModal from "../components/modals/ErrorModal";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useRouter } from "next/navigation";

export default function ChatRoute() {
  const router = useRouter();

  // ------------------ States ------------------
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your AI therapist. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // ------------------ Handlers ------------------
  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ Auth Check ------------------
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      router.replace("/signin");
    }
  }, []);

  const handleNewMessage = (newMessage: Message): void => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div>
      <div className="mx-auto p-6 h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6">
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
