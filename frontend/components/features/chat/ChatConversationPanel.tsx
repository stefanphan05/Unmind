import Message from "@/types/message";
import ChatMessage from "./ChatMessage";
import PromptBox from "./PromptBox";
import TypingIndicator from "./TypingIndicator";
import { ApiError } from "next/dist/server/api-utils";

interface ChatConversationPanelProps {
  messages: Message[];
  isTherapistResponseLoading: boolean;
  onError: (error: ApiError) => void;
  onRefresh: () => void;
  setIsTherapistResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatConversationPanel({
  messages,
  isTherapistResponseLoading,
  onError,
  onRefresh,
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
