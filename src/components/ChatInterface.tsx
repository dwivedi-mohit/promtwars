"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED = [
  "How do I register to vote?",
  "Explain the election timeline.",
  "What is a VVPAT machine?",
  "How is vote counting secured?",
];

function formatResponse(text: string) {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // H3 headings
    .replace(/^### (.*?)$/gm, "<strong style='font-size:1rem;display:block;margin:12px 0 4px'>$1</strong>")
    // H2 headings
    .replace(/^## (.*?)$/gm, "<strong style='font-size:1.05rem;display:block;margin:14px 0 6px'>$1</strong>")
    // Numbered lists
    .replace(/^\d+\.\s+(.*)/gm, "<li style='margin-left:16px;list-style:decimal;margin-bottom:4px'>$1</li>")
    // Bullet points (* or -)
    .replace(/^[\*\-]\s+(.*)/gm, "<li style='margin-left:16px;margin-bottom:4px'>$1</li>")
    // Paragraphs
    .replace(/\n\n/g, "</p><p style='margin-bottom:10px'>")
    .replace(/\n/g, "<br/>");
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to ElectSmart. I'm your AI Election Guide.\n\nI can help you understand the election process, voter registration, voting timelines, and civic duties.\n\n**How can I assist you today?**",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "Failed to get a response.");

      setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", content: data.reply, timestamp: new Date() }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-group ${msg.role}`}>
            <div className="msg-avatar">
              {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="msg-content msg-prose" dangerouslySetInnerHTML={{ __html: `<p>${formatResponse(msg.content)}</p>` }} />
          </div>
        ))}
        {isLoading && (
          <div className="msg-group assistant">
            <div className="msg-avatar"><Bot size={18} /></div>
            <div className="msg-content" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div className="loader-dot"/><div className="loader-dot"/><div className="loader-dot"/>
            </div>
          </div>
        )}
        {error && (
          <div className="msg-group assistant">
            <div className="msg-avatar" style={{ color: '#ef4444', borderColor: '#ef4444' }}><AlertCircle size={18} /></div>
            <div className="msg-content" style={{ border: '1px solid #7f1d1d', background: '#450a0a', color: '#fca5a5' }}>
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        {messages.length <= 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {SUGGESTED.map(q => (
              <button key={q} onClick={() => sendMessage(q)} className="button-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            rows={1}
            disabled={isLoading}
            className="chat-textarea"
          />
          <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} className="btn-send">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
