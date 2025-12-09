"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

// Type imports
import Message from "@/types/message";

// API imports
import { getAllMessages } from "@/lib/api/chat";
import { getStoredToken } from "@/lib/utils/authToken";
import Sidebar from "@/components/features/sessions/components/sidebar/Sidebar";
import Header from "@/components/layout/Header";
import RecordingView from "@/components/features/chat/RecordingView";
import ChatConversationPanel from "@/components/features/chat/ChatConversationPanel";
import ErrorModal from "@/components/features/modals/ErrorModal";

export default function ChatRoute() {
  const router = useRouter();
  const params = useParams();

  const { error, handleError, closeErrorModal } = useErrorHandler();

  const therapySessionId = Number(params?.therapySessionId);

  // ------------------ States ------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIntialLoading, setIsInitialLoading] = useState<boolean>(true);

  // ------------------ Auth Check ------------------

  // Fetch once on mount
  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      router.replace("/signin");
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsInitialLoading(true);
        const fetched = await getAllMessages(
          token,
          therapySessionId,
          handleError
        );

        if (fetched) {
          setMessages(fetched);
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchMessages();
  }, [therapySessionId]);

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleClearMessages = () => {
    setMessages([]);
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
          onError={handleError}
          onClearMessages={handleClearMessages}
        />

        {/* -----------Main Chat Content Area----------- */}
        <div className="p-6 h-[calc(100vh-72px)] flex flex-col lg:flex-row gap-6 ">
          {/* -----------Left Panel: Voice Recording Interface----------- */}
          <div className="lg:w-3/5 flex items-center justify-center">
            <RecordingView
              onError={handleError}
              setIsAILoading={setIsAILoading}
              onNewMessage={handleNewMessage}
            />
          </div>

          {/* -----------Right Panel: Chat Conversation Display and Input----------- */}
          <div className="lg:w-2/5">
            <ChatConversationPanel
              messages={messages}
              isTherapistResponseLoading={isAILoading}
              onError={handleError}
              onNewMessage={handleNewMessage}
              isInitialLoading={isIntialLoading}
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
