import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Zap, ArrowUpRight } from "lucide-react";
import { Product } from "../types";
import { useToast } from "./Toast";

interface NewArrivalsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function NewArrivals({ products, onProductClick }: NewArrivalsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cardRotations, setCardRotations] = useState<{ [key: string]: number }>({});
  const toast = useToast();

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const currentScroll = container.scrollLeft;
    setScrollPosition(currentScroll);

    // Calculate Y rotation for each card based on its position in the viewport
    const viewportWidth = container.clientWidth;
    const containerLeft = container.getBoundingClientRect().left;
    const cards = container.querySelectorAll(".kinetic-scroll-card");

    const newRotations: { [key: string]: number } = {};

    cards.forEach((card) => {
      const cardId = card.getAttribute("data-id");
      if (!cardId) return;

      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      
      // Calculate card position relative to viewport center (-1 to 1)
      const relativePosition = (cardCenter - (containerLeft + viewportWidth / 2)) / (viewportWidth / 2);
      
      // Rotate up to 15 degrees based on horizontal position
      const rotation = Math.max(-15, Math.min(15, relativePosition * 15));
      newRotations[cardId] = rotation;
    });

    setCardRotations(newRotations);
  };

  // Recalculate on mount and when scrolling list
  useEffect(() => {
    setTimeout(handleScroll, 100); // Small timeout to ensure elements are rendered
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleScroll);
    };
  }, [products]);

  const scrollLeftBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRightBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <div id="new-arrivals-section" className="relative bg-[#050505] py-24 px-4 sm:px-8 border-t border-b border-neutral-900 overflow-hidden">
      
      {/* Background neon visual indicators */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-1.5 text-blue-500 font-mono text-[10px] tracking-widest uppercase mb-2">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>KINETIC FLUID RUNWAY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight uppercase">
            NEW DESIGNS
          </h2>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={scrollLeftBtn}
            className="w-11 h-11 rounded-full cursor-pointer border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 hover:text-white hover:border-blue-500/50 transition-all"
            aria-label="Scroll left new arrivals"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRightBtn}
            className="w-11 h-11 rounded-full cursor-pointer border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 hover:text-white hover:border-blue-500/50 transition-all"
            aria-label="Scroll right new arrivals"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL RUNWAY */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto scrollbar-none pb-12 px-2 select-none"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {products.map((p) => {
          const rotationY = cardRotations[p.id] || 0;
          return (
            <div
              key={p.id}
              data-id={p.id}
              className="kinetic-scroll-card min-w-[280px] sm:min-w-[340px] w-[340px] h-[480px] scroll-snap-align-start flex-shrink-0 transition-transform duration-300 ease-out"
              style={{
                perspective: "1000px",
                scrollSnapAlign: "start"
              }}
            >
              <div
                className="w-full h-full rounded-2xl bg-gradient-to-b from-[#111] to-[#040404] border border-neutral-800 overflow-hidden relative group transition-all duration-300"
                style={{
                  transform: `rotateY(${rotationY}deg)`,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Image panel */}
                <div className="w-full h-[65%] overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <span className="absolute top-4 left-4 bg-blue-950/80 backdrop-blur-md border border-blue-500/40 text-blue-400 text-[10px] font-mono tracking-widest px-3 py-1 rounded-sm uppercase">
                    ARRIVED
                  </span>
                </div>

                 {/* Info and action */}
                <div className="p-5 flex flex-col justify-between h-[35%] bg-[#080808]">
                  <div>
                    <h3 className="text-base font-sans font-medium text-white line-clamp-1 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-xs font-sans text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 border-t border-neutral-900 pt-3">
                    <span className="text-base font-mono font-bold text-white">
                      {p.price}
                    </span>
                    <button
                      onClick={() => onProductClick(p)}
                      className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 hover:text-white uppercase transition-colors tracking-widest cursor-pointer"
                    >
                      SPECIFICATIONS <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
