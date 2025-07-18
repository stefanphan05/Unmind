"use client";
import Message from "@/types/message";
import React, { useEffect, useState } from "react";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest = false,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Only apply typing effect to assistant messages that are the latest
    if (message.role === "assistant" && isLatest) {
      setIsTyping(true);
      setDisplayedContent("");

      let currentIndex = 0;
      const typingSpeed = 25;

      const typeMessage = () => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeMessage, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };

      // Start typing after a small delay
      setTimeout(typeMessage, 100);
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [message.content, message.role, isLatest]);

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } items-center gap-3 mb-3`}
    >
      <div
        className={`max-w-lg p-3 text-[14px] ${
          message.role === "user"
            ? "bg-gray-800 text-white rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-md"
            : "bg-gray-100 text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md"
        }`}
      >
        {displayedContent}
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
