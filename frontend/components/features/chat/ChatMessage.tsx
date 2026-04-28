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
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } items-center gap-3 mb-3`}
    >
      <div
        className={`text-[14px] ${
          message.role === "user"
            ? "p-3 max-w-sm input-field text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-md"
            : "text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md"
        }`}
      >
        {displayedContent}
      </div>
    </div>
  );
};

export default ChatMessage;
