import React from "react";

interface LoadingMessageProps {
  loadingType: "text" | "audio" | undefined;
  isAudioProcessing?: boolean;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({
  loadingType,
  isAudioProcessing,
}) => {
  return (
    <>
      {isAudioProcessing && (
        <div className="flex justify-end items-center gap-3 mb-3">
          <div className="bg-gray-800 text-white rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl rounded-br-md p-3 text-[14px]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading audio...
            </div>
          </div>
        </div>
      )}
      {loadingType === "text" && (
        <div className="flex justify-start items-center gap-3 mb-3">
          <div className="bg-gray-100 text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md p-3 text-[14px]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Thinking...
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingMessage;
