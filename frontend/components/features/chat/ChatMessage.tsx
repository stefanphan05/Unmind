import Message from "@/types/message";
import React, { useEffect, useState } from "react";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  onContentRender?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest,
  onContentRender,
}) => {
  const isAssistant = message.role === "assistant";
  const fullContent = message.content ?? "";
  const shouldAnimate = isAssistant && message.shouldAnimate && isLatest;
  const [displayedContent, setDisplayedContent] = useState(
    shouldAnimate ? "" : fullContent
  );

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedContent(fullContent);
      return;
    }

    if (!fullContent.length) {
      setDisplayedContent("");
      return;
    }

    let currentIndex = 0;
    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setDisplayedContent(fullContent.slice(0, currentIndex));

      if (currentIndex >= fullContent.length) {
        window.clearInterval(typingInterval);
      }
    }, 18);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [fullContent, shouldAnimate]);

  useEffect(() => {
    if (!onContentRender) {
      return;
    }

    onContentRender();
  }, [displayedContent, onContentRender]);

  return (
    <div
      className={`chat-message ${
        message.role === "user"
          ? "chat-message--user"
          : "chat-message--assistant"
      }`}
    >
      <div
        className={`chat-message__bubble ${
          message.role === "user"
            ? "chat-message__bubble--user"
            : "chat-message__bubble--assistant"
        }`}
      >
        <span className="chat-message__text">{displayedContent}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
