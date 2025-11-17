import React, { useState } from "react";

export const ChatInput = ({ onSend }: { onSend: (value: string) => void }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="px-6 py-4 border-t border-blue-100 bg-white">
      <div className="relative w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="w-full pr-12 pl-4 py-2 text-sm bg-[#f8fafc] text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A6F4] transition"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#00A6F4] hover:bg-[#008cd0] transition text-white shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10l9 4 9-4m-9 4v6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
