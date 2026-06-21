import React, { useRef, useState, MouseEvent } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
  id,
  type = "button"
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Pull intensity factor (adjust for high-end subtle pull)
    const pullFactor = 0.28; 
    
    setPosition({
      x: distanceX * pullFactor,
      y: distanceY * pullFactor
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      id={id}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center transition-all ${className}`}
    >
      {/* Background radial highlight or border glow if needed */}
      <span className="absolute inset-0 rounded-full bg-white/[0.03] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      {children}
    </motion.button>
  );
}
