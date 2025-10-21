// components/ChatContainer.tsx
import React, { useEffect, useRef, useState } from "react";
import { sanitizeInput } from "../utils/senitize";
import Message from "./Message";
import ChatInput from "./ChatInput";

type Message = { 
  id: string; 
  role: "user" | "assistant"; 
  text: string; 
  createdAt: number 
};

const STORAGE_KEY = "chat_conversation_v1";

export default function ChatContainer() {
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
  const streamTextRef = useRef("");

  useEffect(() => {
    try { 
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); 
    } catch {}
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
    const userMsg: Message = { 
      id: `${Date.now()}-u`, 
      role: "user", 
      text: sanitized, 
      createdAt: Date.now() 
    };
    
    appendMessage(userMsg);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    controllerRef.current = new AbortController();
    streamTextRef.current = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ 
            role: m.role, 
            content: m.text 
          })), 
          model: undefined 
        }),
        headers: { "Content-Type": "application/json" },
        signal: controllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(`Error del servidor: ${res.status} ${text}`);
      }

      const assistantId = `${Date.now()}-a`;
      appendMessage({ 
        id: assistantId, 
        role: "assistant", 
        text: "", 
        createdAt: Date.now() 
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          streamTextRef.current += chunk;
          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { 
              ...m, 
              text: sanitizeInput(streamTextRef.current) 
            } : m))
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      appendMessage({ 
        id: `${Date.now()}-err`, 
        role: "assistant", 
        text: `Error: ${errorMessage}`, 
        createdAt: Date.now() 
      });
    }
  }

  function stopStream() {
    controllerRef.current?.abort();
    setIsTyping(false);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-6 bg-white mx-auto my-6 rounded-xl shadow-sm max-w-5xl w-full" id="messages" style={{scrollBehavior: 'smooth'}}>
        {messages.length === 0 && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-light text-black mb-2">Hola</h1>
            <p className="text-gray-600 text-lg">¿En qué puedo ayudarte?</p>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((m, index) => (
            <div key={m.id} className="animate-floatUp" style={{animationDelay: `${index * 0.1}s`}}>
              <Message message={m} />
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500 animate-fadeIn">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm">Escribiendo...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        loading={loading}
        onStop={stopStream}
      />
    </div>
  );
}
