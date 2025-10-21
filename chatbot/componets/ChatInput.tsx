// components/ChatInput.tsx
import React from "react";
import Avatar from "./Avatar";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  onStop: () => void;
}

export default function ChatInput({ 
  input, 
  setInput, 
  onSend, 
  loading, 
  onStop 
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-6 bg-white mx-auto mb-6 rounded-xl shadow-sm max-w-5xl w-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Avatar type="user" size="sm" />
          
          <div className="flex-1 flex items-center bg-gray-100 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-3 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm"
              maxLength={1000}
              disabled={loading}
            />
            
            <button 
              onClick={onSend} 
              disabled={loading || !input.trim()} 
              className="mr-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="mt-2 flex justify-center">
            <button 
              onClick={onStop} 
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors text-sm"
            >
              Detener
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
