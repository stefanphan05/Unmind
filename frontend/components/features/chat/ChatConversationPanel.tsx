import { ApiError } from "next/dist/server/api-utils";

import Message from "@/types/message";
import { useChatAutoScroll } from "@/lib/hooks/useChatAutoScroll";

import TypingIndicator from "./TypingIndicator";
import PromptBox from "./PromptBox";
import ChatMessage from "./ChatMessage";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

interface ChatConversationPanelProps {
  messages: Message[];
  isTherapistResponseLoading: boolean;
  onError: (error: ApiError) => void;
  onNewMessage: (message: Message) => void;
  isInitialLoading: boolean;
  setIsTherapistResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTone: string;
}

export default function ChatConversationPanel({
  messages,
  isTherapistResponseLoading,
  onError,
  onNewMessage,
  isInitialLoading,
  setIsTherapistResponseLoading,
  selectedTone,
}: ChatConversationPanelProps) {
  const latestMessageRole = messages.at(-1)?.role;
  const {
    scrollContainerRef,
    bottomAnchorRef,
    handleScroll,
    handleLatestAssistantRender,
  } = useChatAutoScroll({
    messageCount: messages.length,
    latestMessageRole,
    isInitialLoading,
    isTherapistResponseLoading,
  });

  const isLatestMessage = (messageIndex: number): boolean => {
    return messageIndex === messages.length - 1;
  };
  return (
    <div className="flex flex-col h-full">
      {/* ------------------Scrollable message history container------------------ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ------------------Chat Messages Display Area------------------ */}
        <div
          ref={scrollContainerRef}
          className="flex-1 p-4 overflow-y-auto scroll-smooth"
          onScroll={handleScroll}
        >
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
                    onContentRender={
                      isLatestMessage(index) ? handleLatestAssistantRender : undefined
                    }
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
          <div ref={bottomAnchorRef} />
        </div>
      </div>

      {/* ------------------Message Input Interface------------------ */}
      <PromptBox
        onError={onError}
        onNewMessage={onNewMessage}
        setIsAILoading={setIsTherapistResponseLoading}
        selectedTone={selectedTone}
      />
    </div>
  );
}
