import { useState } from "react";
import { ApiError } from "next/dist/server/api-utils";

import Message from "@/types/message";
import { useChatAutoScroll } from "@/lib/hooks/useChatAutoScroll";

import TypingIndicator from "./TypingIndicator";
import PromptBox from "./PromptBox";
import ChatMessage from "./ChatMessage";
import RecordingView from "./RecordingView";

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
  const [inputMode, setInputMode] = useState<"chat" | "voice">("chat");

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
    <div className="chat-conversation flex flex-1 flex-col min-h-0">
      {/* ------------------Scrollable message history container------------------ */}
      <div
        ref={scrollContainerRef}
        className="chat-messages-scroll chat-page__messages"
        onScroll={handleScroll}
      >
        {isInitialLoading ? (
          <div className="chat-loading">
            <div className="chat-loading__spinner" aria-hidden="true" />
            <p>Loading your conversation...</p>
          </div>
        ) : (
          <>
            {messages.length > 0 || isTherapistResponseLoading ? (
              <div className="chat-messages-list">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={isLatestMessage(index)}
                    onContentRender={
                      isLatestMessage(index)
                        ? handleLatestAssistantRender
                        : undefined
                    }
                  />
                ))}
                {isTherapistResponseLoading && <TypingIndicator />}
              </div>
            ) : (
              <div className="chat-empty">
                <div className="chat-empty__decor" aria-hidden="true" />
                <p className="chat-empty__title font-display">
                  This is your space.
                </p>
                <p className="chat-empty__subtitle">
                  Share whatever&apos;s on your mind. There&apos;s no wrong way
                  to start.
                </p>
              </div>
            )}
          </>
        )}
        <div ref={bottomAnchorRef} />
      </div>

      {/* ------------------Input zone------------------ */}
      <div className="chat-input-zone">
        <div className="chat-mode-toggle" role="tablist" aria-label="Input mode">
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === "chat"}
            className={`chat-mode-toggle__tab ${
              inputMode === "chat" ? "chat-mode-toggle__tab--active" : ""
            }`}
            onClick={() => setInputMode("chat")}
          >
            Chat
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === "voice"}
            className={`chat-mode-toggle__tab ${
              inputMode === "voice" ? "chat-mode-toggle__tab--active" : ""
            }`}
            onClick={() => setInputMode("voice")}
          >
            Voice
          </button>
          <span
            className={`chat-mode-toggle__slider ${
              inputMode === "voice" ? "chat-mode-toggle__slider--voice" : ""
            }`}
            aria-hidden="true"
          />
        </div>

        <div
          className={`chat-input-mode ${
            inputMode === "voice"
              ? "chat-input-mode--voice"
              : "chat-input-mode--chat"
          }`}
        >
          <div className="chat-input-mode__panel chat-input-mode__panel--chat">
            <PromptBox
              onError={onError}
              onNewMessage={onNewMessage}
              setIsAILoading={setIsTherapistResponseLoading}
              selectedTone={selectedTone}
            />
          </div>
          <div className="chat-input-mode__panel chat-input-mode__panel--voice">
            <RecordingView
              onError={onError}
              setIsAILoading={setIsTherapistResponseLoading}
              onNewMessage={onNewMessage}
              selectedTone={selectedTone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
