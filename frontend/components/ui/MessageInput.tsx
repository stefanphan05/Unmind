import React, { useEffect, useRef } from "react";

interface MessageInputProps {
  textMessage: string;
  setTextMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  textMessage,
  setTextMessage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    const lineHeight = 22;
    const maxHeight = lineHeight * 4;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [textMessage]);

  return (
    <textarea
      ref={textareaRef}
      className="chat-input-field"
      placeholder="Share what's on your mind..."
      value={textMessage}
      onChange={(e) => setTextMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
        }
      }}
      rows={1}
      required
    />
  );
};

export default MessageInput;
