"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

function AmbientBlobs() {
  return (
    <div className="ambient-blobs" aria-hidden="true">
      <div className="ambient-blob ambient-blob--1" />
      <div className="ambient-blob ambient-blob--2" />
      <div className="ambient-blob ambient-blob--3" />
    </div>
  );
}

// Type imports
import Message from "@/types/message";

// API imports
import { getAllMessages } from "@/lib/api/chat";
import { getStoredToken } from "@/lib/utils/authToken";
import Sidebar from "@/components/features/sessions/components/sidebar/Sidebar";
import Header from "@/components/layout/Header";
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

  const [selectedTone, setSelectedTone] = useState("compassionate");

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
    <div
      className={`chat-page ${fraunces.variable} ${sourceSans.variable} flex h-screen`}
    >
      <AmbientBlobs />

      {/* -----------Therapy Sessions Sidebar - including previous sessions----------- */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* -----------Main Chat Interface Container----------- */}
      <div className="chat-page__main flex flex-1 flex-col min-w-0 min-h-0">
        {/* -----------Top bar----------- */}
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onError={handleError}
          onClearMessages={handleClearMessages}
          onToneChange={(tone) => setSelectedTone(tone)}
        />

        {/* -----------Message area + input zone----------- */}
        <ChatConversationPanel
          messages={messages}
          isTherapistResponseLoading={isAILoading}
          onError={handleError}
          onNewMessage={handleNewMessage}
          isInitialLoading={isIntialLoading}
          setIsTherapistResponseLoading={setIsAILoading}
          selectedTone={selectedTone}
        />
      </div>

      {/* -----------Error Modal - Displays error messages to user----------- */}
      <ErrorModal error={error} onClose={closeErrorModal} />
    </div>
  );
}
