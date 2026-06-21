import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, ArrowUpRight, MessageSquare } from "lucide-react";
import { Message } from "../types";
import { useToast } from "./Toast";

interface StylistWidgetProps {
  isLoggedIn: boolean;
  username?: string;
}

export default function StylistWidget({ isLoggedIn, username }: StylistWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "stylist",
      text: "Welcome to [SHOP NAME]'s virtual boutique. I am your automated private stylist, tuned to architectural menswear cuts. How can I help refine your silhouette today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          messageHistory: messages.map(m => ({ role: m.sender, content: m.text }))
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: "stylist",
            text: data.reply || "I am processing your style request...",
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.showToast("Stylist core connection dropped", "error");
      
      // Fallback response for offline/development simplicity
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: "stylist",
            text: "My apologies, the atelier's wireless terminal is resetting. Rest assured, our wool and leather pieces are curated around pristine lines of design.",
            timestamp: new Date()
          }
        ]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-40 group select-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={handleToggle}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0a0a0f]/90 border border-blue-500/50 hover:border-blue-400 text-white cursor-pointer shadow-[0_10px_30px_rgba(59,130,246,0.25)] backdrop-blur-md transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-blue-500/10 before:-z-10 before:scale-105 active:scale-95"
            aria-label="Open AI Stylist"
          >
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">AI COUTURE ASSISTANT</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[325px] sm:w-[380px] h-[480px] bg-[#050508]/95 border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f]/80 border-b border-neutral-800/60 relative">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-950/30 border border-blue-800/50 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">[SHOP NAME] STYLIST</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">ATELIER DIRECT LINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="p-1 px-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 block" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-[#050508]">
              {messages.map((m) => {
                const isStylist = m.sender === "stylist";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isStylist ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
                        isStylist
                          ? "bg-neutral-900/60 text-neutral-300 border border-neutral-800/80 rounded-tl-none font-light"
                          : "bg-white text-black rounded-tr-none font-medium"
                      }`}
                    >
                      {m.text}
                      <span className={`block text-[8px] font-mono mt-1 text-right  ${isStylist ? "text-neutral-600" : "text-neutral-700"}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-3.5 py-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 bg-[#0a0a0f] border-t border-neutral-800/60 flex gap-2">
              <input
                type="text"
                placeholder="Ask about materials, overcoats, sneakers..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-[#040406] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-blue-500 font-sans"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
