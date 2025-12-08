import { ApiError } from "next/dist/server/api-utils";

import Message from "@/types/message";

import TypingIndicator from "./TypingIndicator";
import PromptBox from "./PromptBox";
import ChatMessage from "./ChatMessage";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

interface ChatConversationPanelProps {
  messages: Message[];
  isTherapistResponseLoading: boolean;
  onError: (error: ApiError) => void;
  onRefresh: () => void;
  isInitialLoading: boolean;
  setIsTherapistResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatConversationPanel({
  messages,
  isTherapistResponseLoading,
  onError,
  onRefresh,
  isInitialLoading,
  setIsTherapistResponseLoading,
}: ChatConversationPanelProps) {
  const isLatestMessage = (messageIndex: number): boolean => {
    return messageIndex === messages.length - 1;
  };
  return (
    <div className="flex flex-col h-full">
      {/* ------------------Scrollable message history container------------------ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ------------------Chat Messages Display Area------------------ */}
        <div className="p-4 overflow-y-auto scroll-smooth">
          {/* ------------------Render all existing messages------------------ */}
          {isInitialLoading ? (
            <LoadingOverlay
              isVisible={isInitialLoading}
              message="Loading your conversation..."
            />
          ) : (
            <>
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={isLatestMessage(index)}
                  />
                ))
              ) : (
                <div className="text-gray-500 text-center py-10">
                  No messages yet. Start a conversation!
                </div>
              )}
            </>
          )}
          {/* ------------------AI response loading indicator------------------ */}
          {isTherapistResponseLoading && <TypingIndicator />}
        </div>
      </div>

      {/* ------------------Message Input Interface------------------ */}
      <PromptBox
        onError={onError}
        onRefresh={onRefresh}
        setIsAILoading={setIsTherapistResponseLoading}
      />
    </div>
  );
}
