// components/ChatClient.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { sanitizeInput } from "../utils/senitize";
import MessageBubble from "./MessageBubble";

type Message = { id: string; role: "user" | "assistant"; text: string; createdAt: number };

const STORAGE_KEY = "chat_conversation_v1";

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const streamTextRef = useRef(""); // texto parcial de la respuesta

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, isTyping]);

  const appendMessage = (m: Message) => setMessages(prev => [...prev, m]);

  async function sendMessage() {
    const raw = input.trim();
    if (!raw) return;
    const sanitized = sanitizeInput(raw);
    const userMsg: Message = { id: `${Date.now()}-u`, role: "user", text: sanitized, createdAt: Date.now() };
    appendMessage(userMsg);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    // Start streaming response from backend
    controllerRef.current = new AbortController();
    streamTextRef.current = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.text })), model: undefined }),
        headers: { "Content-Type": "application/json" },
        signal: controllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(`Error del servidor: ${res.status} ${text}`);
      }

      // Create a placeholder assistant message that will be updated as stream arrives
      const assistantId = `${Date.now()}-a`;
      appendMessage({ id: assistantId, role: "assistant", text: "", createdAt: Date.now() });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // backend will send plain text chunks (we'll sanitize on append)
          streamTextRef.current += chunk;
          // update last assistant message
          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { ...m, text: sanitizeInput(streamTextRef.current) } : m))
          );
        }
      }

      setIsTyping(false);
      setLoading(false);
      controllerRef.current = null;
    } catch (err: unknown) {
      console.error(err);
      setIsTyping(false);
      setLoading(false);
      // show error as assistant message
      const errorMessage = err instanceof Error ? err.message : String(err);
      appendMessage({ id: `${Date.now()}-err`, role: "assistant", text: `Error: ${errorMessage}`, createdAt: Date.now() });
    }
  }

  function stopStream() {
    controllerRef.current?.abort();
    setIsTyping(false);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-8" id="messages" style={{scrollBehavior: 'smooth'}}>
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-blue-400 text-6xl mb-6">🤖</div>
            <h1 className="text-2xl font-semibold text-white mb-2">Hola, soy tu asistente AI</h1>
            <p className="text-gray-400 text-lg">¿En qué puedo ayudarte hoy?</p>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, index) => (
            <div key={m.id} className="animate-slideInUp" style={{animationDelay: `${index * 0.1}s`}}>
              <MessageBubble message={m} />
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-3 text-gray-400 animate-fadeIn">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm">El asistente está escribiendo...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input moderno */}
      <div className="p-6 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              <button className="p-3 text-gray-400 hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { 
                  if (e.key === "Enter") { 
                    e.preventDefault(); 
                    sendMessage(); 
                  } 
                }}
                placeholder="Pregunta a tu asistente AI..."
                className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                maxLength={1000}
                aria-label="mensaje"
              />
              
              <div className="flex items-center space-x-2 pr-3">
                <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0v4m0-4h4m-4 0H6" />
                  </svg>
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </button>
                
                <button 
                  onClick={sendMessage} 
                  disabled={loading || !input.trim()} 
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {loading && (
              <div className="mt-3 flex justify-center">
                <button 
                  onClick={stopStream} 
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
                >
                  Detener generación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
