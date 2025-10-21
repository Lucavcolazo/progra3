// app/page.tsx
"use client";
import React from "react";
import dynamic from "next/dynamic";

import "./globals.css";

// Import dinámico para que ChatContainer se ejecute como Client Component
const ChatContainer = dynamic(() => import("../componets/ChatContainer"), { ssr: false });

export default function Page() {
  return <ChatContainer />;
}
