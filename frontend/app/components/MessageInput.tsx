import React from "react";

interface MessageInputProps {
  textMessage: string;
  setTextMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  textMessage,
  setTextMessage,
}) => {
  return (
    <input
      className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#262626] h-10"
      placeholder="Share what's on your mind..."
      type="text"
      value={textMessage}
      onChange={(e) => setTextMessage(e.target.value)}
      required
    />
  );
};

export default MessageInput;
