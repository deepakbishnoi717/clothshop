import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Sparkles } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "info" | "success" | "error";
}

interface ToastContextType {
  showToast: (text: string, type?: "info" | "success" | "error") => void;
  showDefaultToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: "info" | "success" | "error" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const showDefaultToast = () => {
    // Exact requested string: "Exclusive Feature Setup by Deepak Bishnoi."
    showToast("Exclusive Feature Setup by Deepak Bishnoi.", "info");
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showDefaultToast }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-lg bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-800 shadow-[0_4px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan-500 before:to-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950/50 border border-cyan-800/50">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">SYSTEM NOTIFICATION</p>
                  <p className="text-sm font-sans text-white font-medium mt-0.5">{toast.text}</p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-neutral-800 rounded-full transition-colors group cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
