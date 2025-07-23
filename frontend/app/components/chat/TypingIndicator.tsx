import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-3 max-w-fit bg-gray-100 text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
}
