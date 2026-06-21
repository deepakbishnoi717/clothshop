import React, { useState, MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowDown, Flame, Sparkles, LogIn } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useToast } from "./Toast";

interface HeroProps {
  onJoinVIPClick: () => void;
  onBrowseCollectionClick: () => void;
  isLoggedIn: boolean;
  username?: string;
  onAuthClick: () => void;
}

export default function Hero({
  onJoinVIPClick,
  onBrowseCollectionClick,
  isLoggedIn,
  username,
  onAuthClick
}: HeroProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  const toast = useToast();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { left, top, width, height } = container.getBoundingClientRect();
    
    // Mouse coords relative to Hero container
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Normalized position from -1 to 1
    const normalizedX = (x / width) * 2 - 1;
    const normalizedY = (y / height) * 2 - 1;
    
    // Tilt degrees (subtle, high-end 22 deg maximum)
    const rotateX = -normalizedY * 22;
    const rotateY = normalizedX * 22;

    // Shift dynamic glowing halo behind product
    const shadowX = -normalizedX * 15;
    const shadowY = -normalizedY * 15;

    setTilt({ rotateX, rotateY, shadowX, shadowY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  };

  return (
    <section 
      id="hero-section"
      className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden"
    >
      {/* 3D Cosmic Holographic Grid Vector Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Radial Metallic Gradient Overlays */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Status Line */}
      <div className="z-10 mb-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 border border-blue-800/40 bg-blue-950/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-blue-400"
        >
          <Flame className="w-3.5 h-3.5 animate-pulse text-blue-400" />
          <span>AUTUMN / WINTER COLLECTIVE 2026</span>
        </motion.div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Brand & Headline */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-xs font-mono font-medium tracking-[0.4em] text-neutral-400 uppercase mb-4"
          >
            EXPERIENCE THE ARCHIVE
          </motion.h2>

          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-6xl xl:text-7xl font-sans font-bold text-white tracking-tight leading-[1.05] uppercase"
          >
            REDEFINE <br />
            YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-blue-500">STYLE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base font-sans text-neutral-400 mt-6 max-w-lg leading-relaxed font-light"
          >
            Bespoke tailoring engineered with architectural lines and cyber-performance fabrics. Designed entirely for the modern, discerning minimalist.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto"
          >
            <MagneticButton
              onClick={onBrowseCollectionClick}
              className="px-8 h-14 bg-white text-black font-mono text-xs tracking-widest uppercase transition-all rounded-sm font-semibold border border-transparent shadow-[0_8px_30px_rgba(255,255,255,0.15)] flex items-center justify-center"
            >
              EXPLORE COLLECTION
            </MagneticButton>

            {!isLoggedIn ? (
              <MagneticButton
                onClick={onJoinVIPClick}
                className="px-8 h-14 bg-transparent border border-neutral-800 text-white font-mono text-xs tracking-widest uppercase hover:bg-white/5 transition-all rounded-sm flex items-center justify-center gap-2"
              >
                JOIN THE CLUB
              </MagneticButton>
            ) : (
              <div className="flex items-center gap-3 px-5 h-14 bg-neutral-900/60 backdrop-blur-md rounded-sm border border-neutral-800">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#a8a8a8]">
                  WELCOME, <span className="text-white font-bold">{username}</span>
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: 3D Product Float */}
        <div 
          className="lg:col-span-5 flex items-center justify-center py-8 lg:py-0"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center perspective-[1000px] cursor-grab active:cursor-grabbing"
          >
            {/* Dynamic Halo Glow behind */}
            <div 
              className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-tr from-blue-500 to-violet-600 blur-[80px] opacity-25 transition-all duration-300 ease-out"
              style={{
                transform: `translate(${tilt.shadowX}px, ${tilt.shadowY}px)`
              }}
            />

            {/* Sub-Card Base containing Floating Jacket */}
            <motion.div
              animate={{ 
                rotateX: tilt.rotateX, 
                rotateY: tilt.rotateY,
                y: [0, -10, 0] 
              }}
              transition={{
                rotateX: { type: "tween", ease: "easeOut", duration: 0.15 },
                rotateY: { type: "tween", ease: "easeOut", duration: 0.15 },
                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Product Card border overlay */}
              <div 
                className="absolute inset-0 rounded-3xl border border-white/[0.06] bg-[#0c0c10]/40 backdrop-blur-lg shadow-2xl overflow-hidden" 
                style={{ transform: "translateZ(-20px)" }}
              />

              {/* Glowing border accents */}
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-blue-500" />
              <div className="absolute top-0 left-0 h-12 w-[1px] bg-blue-500" />
              <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-violet-500" />
              <div className="absolute bottom-0 right-0 h-12 w-[1px] bg-violet-500" />

              {/* Main Product Image (Floating high-end jacket) */}
              <img
                src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=800&auto=format&fit=crop"
                alt="Feature Noir Jacket"
                referrerPolicy="no-referrer"
                className="w-4/5 h-auto object-contain select-none drop-shadow-[0_25px_40px_rgba(59,130,246,0.35)] relative pointer-events-none"
                style={{ 
                  transform: "translateZ(60px) rotate(-5deg)", 
                  filter: "brightness(1.05)"
                }}
              />

              {/* 3D Depth Spec overlay */}
              <div 
                className="absolute bottom-6 left-6 font-mono text-[9px] tracking-widest text-[#a8a8a8] bg-black/60 border border-neutral-800 px-3 py-1.5 rounded-sm"
                style={{ transform: "translateZ(30px)" }}
              >
                NOIR COLLECTION // AW26
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Floating Ambient bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity z-10">
        <span className="text-[9px] font-mono tracking-[0.3em] text-[#a8a8a8] uppercase">SCROLL TO CATALOGUE</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-3.5 h-3.5 text-blue-500" />
        </motion.div>
      </div>
    </section>
  );
}
