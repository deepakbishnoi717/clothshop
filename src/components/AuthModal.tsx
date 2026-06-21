import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Key, ShieldCheck, Mail, Sparkles, User, AlertCircle } from "lucide-react";
import { useToast } from "./Toast";
import MagneticButton from "./MagneticButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Authorized credentials require an email mapping.");
      return;
    }
    if (!isLoginTab && !name) {
      setErrorMessage("Registration requires an exclusive Member Name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isLoginTab ? "/api/auth/login" : "/api/auth/register";
      const payload = isLoginTab ? { email } : { name, email };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication clearance failed");
      }

      // Success
      onSuccess(data.token, data.user);
      toast.showToast(
        isLoginTab 
          ? `Welcome back, ${data.user.name}. JWT Session Key loaded.’`
          : `VIP Elite Account generated for ${data.user.name}! Token stored.`,
        "success"
      );
      onClose();
      
      // Cleanup
      setName("");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "An authentication clearance exception was raised.");
      toast.showToast(err.message || "Clearing session failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop glassmorphic */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#0a0a0d]/95 border border-neutral-800 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden p-6 sm:p-8 backdrop-blur-md"
          >
            {/* Top Glow Accent */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-950/40 border border-blue-800/40 flex items-center justify-center">
                  <Key className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-sans font-bold text-white uppercase tracking-wider">VIP CREDENTIALING</h3>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">ESTABLISH SECURE RUNTIME KEY</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 block" />
              </button>
            </div>

            {/* Custom Tab Toggles */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900/60 rounded-lg border border-neutral-800 mb-6">
              <button
                type="button"
                onClick={() => { setIsLoginTab(true); setErrorMessage(""); }}
                className={`py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all cursor-pointer ${
                  isLoginTab 
                    ? "bg-white text-black font-semibold" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                DEPLOY KEY
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginTab(false); setErrorMessage(""); }}
                className={`py-2 text-[10px] font-mono tracking-widest uppercase rounded-md transition-all cursor-pointer ${
                  !isLoginTab 
                    ? "bg-white text-black font-semibold" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                REGISTER ELITE
              </button>
            </div>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-red-950/20 border border-red-800/40 text-red-400 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {!isLoginTab && (
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">MEMBER NAME</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="e.g. JULIUS CAESAR"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 bg-[#040406] border border-neutral-800 rounded-lg pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                      required={!isLoginTab}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 animation-all">
                <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">VIP ASSOCIATED EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="e.g. VIP@SHOPNAME.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-[#040406] border border-neutral-800 rounded-lg pl-10 pr-4 text-[11px] text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <MagneticButton
                  type="submit"
                  className="w-full h-11 bg-white text-black text-[10px] font-mono tracking-widest uppercase font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-blue-600 hover:text-white"
                >
                  <ShieldCheck className="w-4 h-4 text-current" />
                  <span>{isSubmitting ? "AUTHORIZING..." : isLoginTab ? "DEACTIVATE TO RE-DEPLOY KEY" : "ACTIVATE ACCOUNT LIFE-CYCLE"}</span>
                </MagneticButton>
              </div>

              <div className="text-center pt-3">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  Secure cryptographic token signed automatically upon approval.
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
