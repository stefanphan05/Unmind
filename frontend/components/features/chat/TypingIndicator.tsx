import React from "react";

export default function TypingIndicator() {
  return (
    <div
      className="chat-message chat-message--assistant chat-message--typing"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="chat-typing">
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
      </div>
    </div>
  );
}
