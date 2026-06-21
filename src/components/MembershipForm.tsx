import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, User, Sparkles, AlertCircle, Smartphone, ArrowRight } from "lucide-react";
import { STYLE_PREFERENCES } from "../data";
import { useToast } from "./Toast";
import MagneticButton from "./MagneticButton";

interface MembershipFormProps {
  onSuccess: (token: string, user: any) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  currentUser?: any;
}

export default function MembershipForm({ onSuccess, isLoggedIn, onLogout, currentUser }: MembershipFormProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState(""); // Capturing email too so we can handle authenticated JWT registration elegantly!
  const [stylePreference, setStylePreference] = useState(STYLE_PREFERENCES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !whatsapp || !email) {
      setErrorMsg("Elite clearance requires Name, WhatsApp, and Email inputs.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit webhook detail to n8n Webhook Proxy
      const webhookRes = await fetch("/api/webhook/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, stylePreference })
      });

      const webhookData = await webhookRes.json();
      if (!webhookRes.ok) {
        throw new Error(webhookData.error || "Webhook dispatch failed");
      }

      // 2. Register/Login VIP via JWT endpoint to authenticate the state
      const authRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, stylePreference })
      });

      const authData = await authRes.json();
      if (!authRes.ok) {
        // If already registered, try log in instead for smoother UX
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          onSuccess(loginData.token, loginData.user);
          toast.showToast(`Welcome back, verified VIP member: ${loginData.user.name}`, "success");
          return;
        }
        throw new Error(authData.error || "Activation failed");
      }

      // Complete registration
      onSuccess(authData.token, authData.user);
      toast.showToast(`Elite membership granted! Welcome, ${authData.user.name}.`, "success");
      
      // Reset form
      setName("");
      setWhatsapp("");
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected clearance error occurred.");
      toast.showToast(err.message || "Elite status activation failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="vip-section" className="relative bg-[#050505] py-24 px-4 sm:px-8 border-b border-neutral-900 overflow-hidden">
      
      {/* Decorative metal texture background */}
      <div className="absolute inset-0 bg-[#07070a]/20 opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-gradient-to-r from-blue-500/5 to-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 border border-blue-800/40 bg-blue-950/20 px-3.5 py-1 rounded-full text-[10px] font-mono tracking-widest text-blue-400 mb-3.5 uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VIP ELITE PRIVILEGE CHAMBER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight leading-tight uppercase">
            VIP MEMBERSHIP
          </h2>
          <p className="text-xs sm:text-sm font-sans text-neutral-400 mt-3 max-w-xl mx-auto font-light leading-relaxed">
            Acquire private catalog access, priority tailorship slots, international runway invitations, and direct WhatsApp alerts.
          </p>
        </div>

        <div className="bg-[#0a0a0d]/80 border border-neutral-800 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-blue-500 before:to-transparent">
          
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.form
                key="form-join"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {errorMsg && (
                  <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-800/40 text-red-400 text-xs flex items-center gap-2.5 font-mono">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest text-[#a8a8a8] uppercase">YOUR FULL NAME</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="e.g. MARCUS AURELIUS"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 bg-[#040406] border border-neutral-800 rounded-lg pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest text-[#a8a8a8] uppercase">EMAIL (FOR SECURE JWT KEY)</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="email"
                        placeholder="e.g. VIP@SHOPNAME.COM"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 bg-[#040406] border border-neutral-800 rounded-lg pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* WhatsApp Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest text-[#a8a8a8] uppercase">WHATSAPP ACCORDANCE</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 0199 873"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full h-12 bg-[#040406] border border-neutral-800 rounded-lg pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Style Preference */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-widest text-[#a8a8a8] uppercase">COUTURE STYLE ACCENT</label>
                    <select
                      value={stylePreference}
                      onChange={(e) => setStylePreference(e.target.value)}
                      className="w-full h-12 bg-[#040406] border border-neutral-800 rounded-lg px-4 text-sm text-[#a8a8a8] focus:outline-none focus:border-blue-500 focus:text-white transition-all font-sans cursor-pointer"
                    >
                      {STYLE_PREFERENCES.map((pref, i) => (
                        <option key={i} value={pref} className="bg-neutral-950 text-neutral-300">
                          {pref}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-neutral-900 pt-6 flex items-center justify-between flex-col sm:flex-row gap-4">
                  <span className="text-[10px] font-mono text-neutral-500 text-center sm:text-left leading-relaxed">
                    By submitting, you authorize [SHOP NAME] to broadcast secure stock notifications and VIP briefings.
                  </span>
                  <MagneticButton
                    type="submit"
                    className="w-full sm:w-auto h-12 px-8 bg-white text-black text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-600 hover:text-white shadow-lg"
                  >
                    <span>{isSubmitting ? "ACTIVATING..." : "ACQUIRE SECURE STATUS"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="form-welcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-blue-950/55 border border-blue-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Sparkles className="w-7 h-7 text-blue-400" />
                </div>
                
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-sans font-bold text-white uppercase tracking-tight">VIP STATUS ACTIVE</h3>
                  <p className="text-sm font-sans text-neutral-400 font-light max-w-md mx-auto">
                    Welcome to the private enclave, <span className="text-white font-medium">{currentUser?.name}</span>. Your personalized key is loaded and all endpoints are authenticated.
                  </p>
                </div>

                <div className="bg-[#050505] rounded-xl border border-neutral-800 p-5 max-w-md mx-auto space-y-3 font-mono text-left">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-800/60">
                    <span className="text-neutral-500">MEMBER ID</span>
                    <span className="text-white text-right font-medium">{currentUser?.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-800/60">
                    <span className="text-neutral-500">EMAIL ACCOUNT</span>
                    <span className="text-white text-right font-medium">{currentUser?.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">STYLE CONFIG</span>
                    <span className="text-blue-400 text-right font-semibold uppercase">{currentUser?.stylePreference || "Avant-Garde Noir"}</span>
                  </div>
                </div>

                <div className="pt-4 max-w-xs mx-auto flex gap-4">
                  <button
                    onClick={() => toast.showDefaultToast()}
                    className="flex-1 py-2.5 rounded-lg border border-neutral-800 text-[10px] font-mono tracking-wider hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    EXPERT SHELF
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex-1 py-2.5 rounded-lg border border-red-950/40 hover:border-red-800/60 text-red-400 text-[10px] font-mono tracking-wider hover:bg-red-950/20 transition-all cursor-pointer"
                  >
                    DE-AUTH TOKEN
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
