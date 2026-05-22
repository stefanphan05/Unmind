import React from "react";

export default function TypingIndicator() {
  return (
    <div className="chat-message chat-message--assistant">
      <div
        className="chat-message__bubble chat-message__bubble--assistant chat-typing"
        aria-label="Assistant is typing"
      >
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
      </div>
    </div>
  );
}
