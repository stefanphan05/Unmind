import { Send, Mic } from "lucide-react";
import React from "react";

const PromptBox = () => {
  return (
    <div className="bg-white backdrop-blur-lg shadow-lg rounded-lg text-[#5e5e5e] px-4 py-3 ">
      <form className="flex flex-row gap-8">
        <input
          className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#262626]"
          placeholder="Share what's on your mind..."
          required
        />

        <div className="flex text-sm">
          <div className="flex gap-2">
            <p className="flex items-center gap-2 text-sx border border-gray-300/40 px-2 py-1 rounded-lg cursor-pointer hover:bg-[#2b2b2b] hover:text-white transition">
              <Mic className="h-5 " />
            </p>
            <p className="flex items-center gap-2 text-sx border border-gray-300/40 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#2b2b2b] hover:text-white transition">
              <Send className="h-5" />
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;
