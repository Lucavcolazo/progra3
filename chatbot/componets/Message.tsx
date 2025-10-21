// components/Message.tsx
import React from "react";
import Avatar from "./Avatar";

type Message = { 
  id: string; 
  role: "user" | "assistant"; 
  text: string; 
  createdAt: number 
};

interface MessageProps {
  message: Message;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex items-end gap-3 mb-5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar type="assistant" size="md" />}
      
      <div className={`px-5 py-3 rounded-3xl max-w-[75%] ${
        isUser 
          ? "bg-blue-100 text-black rounded-br-md" 
          : "bg-gray-100 text-black rounded-bl-md"
      }`}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.text}
        </div>
      </div>
      
      {isUser && <Avatar type="user" size="md" />}
    </div>
  );
}
