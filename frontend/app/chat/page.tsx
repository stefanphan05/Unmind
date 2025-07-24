"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/useErrorHandler";

// Component imports
import RecordingView from "../components/chat/RecordingView";
import ChatMessage from "../components/chat/ChatMessage";
import PromptBox from "../components/chat/PromptBox";
import ErrorModal from "../components/modals/ErrorModal";
import TypingIndicator from "../components/chat/TypingIndicator";
import Header from "../components/layout/Header";
import Sidebar from "../components/chat/Sidebar";

// Type imports
import Message from "@/types/message";

// API imports
import { getAllMessages } from "@/lib/api/chat";
import { getStoredToken } from "@/utils/authToken";
import ChatConversationPanel from "../components/chat/ChatConversationPanel";

export default function ChatRoute() {
  const router = useRouter();
  const { error, handleError, closeErrorModal } = useErrorHandler();

  // ------------------ States ------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageRefreshTrigger, setMessageRefreshTrigger] = useState(0);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ------------------ Auth Check ------------------

  /**
   * Handle user authentication check and inital message loading
   * TODO: Redicts to signin if no valid token found (FOR NOW, consider allow guest using the application)
   */
  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      router.replace("/signin");
      return;
    }

    fetchMessages(token);
  }, [messageRefreshTrigger]);

  /**
   * Fetches all chat messages from the server using the provided token
   */
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

  /**
   * Triggers a refresh of chat messages from the server after sending new messages
   */
  const triggerChatMessageRefresh = (): void => {
    setMessageRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen">
      {/* -----------Therapy Sessions Sidebar - including previous sessions----------- */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* -----------Main Chat Interface Container----------- */}
      <div className="flex flex-1 flex-col">
        {/* -----------Application Header with navigation and controls----------- */}
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* -----------Main Chat Content Area----------- */}
        <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-72px)] flex flex-col lg:flex-row gap-6 ">
          {/* -----------Left Panel: Voice Recording Interface----------- */}
          <div className="lg:w-3/5 flex items-center justify-center">
            <RecordingView
              onError={handleError}
              setIsAILoading={setIsAILoading}
              onRefresh={triggerChatMessageRefresh}
            />
          </div>

          {/* -----------Right Panel: Chat Conversation Display and Input----------- */}
          <div className="lg:w-2/5 flex flex-col">
            <ChatConversationPanel
              messages={messages}
              isTherapistResponseLoading={isAILoading}
              onError={handleError}
              onRefresh={triggerChatMessageRefresh}
              setIsTherapistResponseLoading={setIsAILoading}
            />
          </div>
        </div>
      </div>

      {/* -----------Error Modal - Displays error messages to user----------- */}
      <ErrorModal error={error} onClose={closeErrorModal} />
    </div>
  );
}
