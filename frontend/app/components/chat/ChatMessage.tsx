import Message from "@/types/message";
import React from "react";
import { Typewriter } from "react-simple-typewriter";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } items-center gap-3 mb-3`}
    >
      <div
        className={`max-w-sm p-3 text-[14px] ${
          message.role === "user"
            ? "bg-gray-800 text-white rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-md"
            : "bg-gray-100 text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md"
        }`}
      >
        {isAssistant && isLatest ? (
          <Typewriter words={[message.content]} typeSpeed={25} />
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
