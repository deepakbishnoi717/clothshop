import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, LogIn, LogOut, CheckCircle2, Instagram, Facebook, MessageSquare } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useToast } from "./Toast";

interface NavbarProps {
  isLoggedIn: boolean;
  username?: string;
  onAuthClick: () => void;
  onLogout: () => void;
  onScrollToVIP: () => void;
  onScrollToCatalog: () => void;
}

export default function Navbar({
  isLoggedIn,
  username,
  onAuthClick,
  onLogout,
  onScrollToVIP,
  onScrollToCatalog
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toast = useToast();

  const handleUnsupportedLink = (name: string) => {
    toast.showToast(`Elite connection to ${name} is being prepared.`, "info");
  };

  const handleSocialConnect = (platform: string, url: string) => {
    window.open(url, "_blank");
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-[#050505]/70 backdrop-blur-md border-b border-white/[0.05] z-30 flex items-center justify-between px-6 sm:px-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      
      {/* Brand logo: Sleek, minimalistic conceptual luxury style */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex flex-col items-start cursor-pointer select-none"
      >
        <span className="text-lg sm:text-xl font-sans font-extrabold text-white tracking-[0.3em] uppercase">
          [ S H O P &nbsp; N A M E ]
        </span>
        <span className="text-[8px] font-mono tracking-[0.6em] text-blue-500 uppercase mt-0.5">
          BESPOKE ATELIER
        </span>
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-8">
        <button
          onClick={onScrollToCatalog}
          className="text-[11px] font-mono tracking-widest text-[#a8a8a8] hover:text-white transition-colors uppercase cursor-pointer"
        >
          COLLECTION
        </button>
        <button
          onClick={onScrollToVIP}
          className="text-[11px] font-mono tracking-widest text-[#a8a8a8] hover:text-white transition-colors uppercase cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-blue-500" /> VIP STATUS
        </button>
        <button
          onClick={() => handleUnsupportedLink("Showrooms")}
          className="text-[11px] font-mono tracking-widest text-[#a8a8a8] hover:text-white transition-colors uppercase cursor-pointer"
        >
          SHOWROOMS
        </button>
      </div>

      {/* Action and verification */}
      <div className="hidden md:flex items-center gap-6">
        
        {/* Social Quick Connect Icons */}
        <div className="flex items-center gap-3.5 border-r border-neutral-800 pr-5">
          <button
            onClick={() => handleSocialConnect("Instagram", "https://instagram.com")}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSocialConnect("Facebook", "https://facebook.com")}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSocialConnect("WhatsApp", "https://wa.me/15550199")}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            title="WhatsApp Channel"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-blue-950/20 border border-blue-800/40 px-3 py-1.5 rounded-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-mono text-blue-200 tracking-wider font-semibold uppercase truncate max-w-[80px]">
                {username}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-red-400 hover:text-red-300 hover:border-red-950/60 transition-colors cursor-pointer text-xs"
              title="Logout VIP key"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <MagneticButton
            onClick={onAuthClick}
            className="h-10 px-5 bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 hover:bg-neutral-800 text-white font-mono text-[10px] tracking-widest uppercase rounded-sm flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>VIP KEY</span>
          </MagneticButton>
        )}
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden flex items-center gap-4">
        {isLoggedIn && (
          <div className="flex items-center gap-1 bg-blue-950/25 border border-blue-800/40 px-2.5 py-1 rounded-full text-[9px] font-mono text-blue-500 uppercase">
            <span>VIP</span>
          </div>
        )}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 block" /> : <Menu className="w-5 h-5 block" />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-20 left-0 right-0 h-auto bg-[#0a0a0f]/95 border-b border-neutral-800/80 p-6 flex flex-col gap-5 md:hidden z-20 backdrop-blur-lg"
          >
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScrollToCatalog();
              }}
              className="text-left py-2 border-b border-neutral-900 text-xs font-mono tracking-widest text-neutral-300 hover:text-white uppercase"
            >
              COLLECTION CATALOGUE
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScrollToVIP();
              }}
              className="text-left py-2 border-b border-neutral-900 text-xs font-mono tracking-widest text-blue-500 hover:text-white uppercase flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> VIP CHAMBER
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleUnsupportedLink("Appointments");
              }}
              className="text-left py-2 border-b border-neutral-900 text-xs font-mono tracking-widest text-neutral-300 hover:text-white uppercase"
            >
              BESPOKE APPOINTMENTS
            </button>

            {/* Social Icons mobile */}
            <div className="flex items-center gap-4 py-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mr-2">CONNECT:</span>
              <button
                onClick={() => handleSocialConnect("Instagram", "https://instagram.com")}
                className="p-1 px-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 hover:text-white"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialConnect("Facebook", "https://facebook.com")}
                className="p-1 px-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 hover:text-white"
              >
                <Facebook className="w-4 h-4 animate-none" />
              </button>
              <button
                onClick={() => handleSocialConnect("WhatsApp", "https://wa.me/15550199")}
                className="p-1 px-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 hover:text-white"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-blue-950/20 border border-blue-800/40 text-center rounded-lg text-xs font-mono text-blue-300">
                    VIP STATUS VERIFIED : {username}
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full h-11 bg-transparent border border-red-950 text-red-400 text-xs font-mono tracking-widest rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    DE-AUTHORIZE SESSION
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAuthClick();
                  }}
                  className="w-full h-11 bg-white text-black font-semibold text-xs font-mono tracking-widest rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  AUTHENTICATE VIP KEY
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
