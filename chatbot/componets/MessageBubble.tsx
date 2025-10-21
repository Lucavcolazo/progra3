// components/MessageBubble.tsx
import React from "react";

type Message = { id: string; role: "user" | "assistant"; text: string; createdAt: number };

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 shadow-lg transform transition-all duration-300 hover:scale-[1.01] ${
          isUser 
            ? "bg-gray-800 text-white border border-gray-700" 
            : "bg-gray-900 text-gray-100 border border-gray-800"
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
        </div>
        <div className={`text-xs text-gray-500 mt-2 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
