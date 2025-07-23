"use client";
import Message from "@/types/message";
import React, { useEffect, useState } from "react";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
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
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
