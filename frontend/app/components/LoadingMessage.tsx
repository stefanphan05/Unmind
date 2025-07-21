import React from "react";

export default function LoadingMessage() {
  return (
    <>
      <div className="flex justify-start items-center gap-3 mb-3">
        <div className="bg-gray-100 text-gray-700 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-md p-3 text-[14px]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            Thinking...
          </div>
        </div>
      </div>
    </>
  );
}
