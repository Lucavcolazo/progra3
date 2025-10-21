// app/page.tsx
"use client";
import React from "react";
import dynamic from "next/dynamic";

import "./globals.css";

// Import dinámico para que ChatClient se ejecute como Client Component
const ChatClient = dynamic(() => import("../componets/ChatClient"), { ssr: false });

export default function Page() {
  return (
    <div className="h-screen w-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 border-r border-gray-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center mb-4 transition-colors">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center mb-4 transition-colors">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="flex-1"></div>
        <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black">
        <ChatClient />
      </div>
    </div>
  );
}
