import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Grid, Pocket, Sparkles, Footprints, Watch } from "lucide-react";

interface TheCollectionProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export default function TheCollection({ onSelectCategory, selectedCategory }: TheCollectionProps) {
  
  const categories = [
    {
      id: "Shirts",
      title: "SHIRTS & LUXURY OUTERWEAR",
      desc: "Tailored overcoats, structural blazers, and mulberry silk shirting featuring dynamic geometric cuts.",
      icon: Pocket,
      gridSpan: "md:col-span-8 h-[280px] sm:h-[350px]",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80",
      tag: "THE ARCHIVE"
    },
    {
      id: "Shoes",
      title: "STRUCTURAL FOOTWEAR",
      desc: "Modular Chelsea boots, carbon-chassis sneakers, and avant-garde leather boots built for active resilience.",
      icon: Footprints,
      gridSpan: "md:col-span-4 h-[280px] sm:h-[350px]",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      tag: "CARBON SERIES"
    },
    {
      id: "Accessories",
      title: "METALLIC ACCESSORIES",
      desc: "Solid sterling cufflinks, titanium sunglasses, and structural leather accessories to define the outline.",
      icon: Watch,
      gridSpan: "md:col-span-4 h-[280px] sm:h-[350px]",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      tag: "STERLING ORE"
    },
    {
      id: "concept",
      title: "[SHOP NAME] COUTURE PHILOSOPHY",
      desc: "We do not manufacture vestments. We draft structural shields. Materials are sourced sustainably across Japan and Italy, engineered to reflect ambient ultraviolet signatures.",
      icon: Sparkles,
      gridSpan: "md:col-span-8 h-[280px] sm:h-[350px]",
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80",
      tag: "CONCEPT"
    }
  ];

  return (
    <section id="collection-section" className="relative bg-[#050505] py-24 px-4 sm:px-8 overflow-hidden border-b border-neutral-900">
      
      {/* Background graphic elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-1.5 text-blue-500 font-mono text-[10px] tracking-widest uppercase mb-2">
          <Grid className="w-3 h-3 text-blue-500" />
          <span>BENTO STRUCTURAL INDEX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight uppercase">
          THE COLLECTION
        </h2>
        <p className="text-sm font-sans text-neutral-400 mt-2 font-light max-w-xl">
          Interact with our architectural categories to filter the active catalog showcase automatically.
        </p>
      </div>

      {/* BENTO MESH GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {categories.map((c) => {
          const isCategoryActive = selectedCategory === c.id;
          const isConceptCard = c.id === "concept";
          const Icon = c.icon;

          return (
            <div
              key={c.id}
              onClick={() => {
                if (!isConceptCard) {
                  onSelectCategory(isCategoryActive ? "ALL" : c.id);
                  // Scroll smoothly to shop section
                  const shopSec = document.getElementById("shop-collection-section");
                  if (shopSec) {
                    shopSec.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className={`group relative rounded-2xl border transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between p-6 ${c.gridSpan} ${
                isCategoryActive 
                  ? "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.15)] bg-neutral-900/80" 
                  : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-950/60"
              }`}
            >
              {/* Product Category Wallpaper */}
              <div className="absolute inset-0 w-full h-full -z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
              </div>

              {/* Top Row specs */}
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono tracking-widest text-[#a8a8a8] border border-neutral-800 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm uppercase">
                  {c.tag}
                </span>
                {!isConceptCard && (
                  <div className={`p-2 rounded-full border transition-all ${
                    isCategoryActive 
                      ? "border-blue-500 text-blue-500 bg-blue-950/40" 
                      : "border-neutral-800 text-neutral-400 group-hover:text-white group-hover:border-neutral-600"
                  }`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Bottom Row Information */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${isCategoryActive ? "text-blue-500" : "text-neutral-500 group-hover:text-blue-500"}`} />
                  <h3 className="text-xs font-mono font-medium tracking-widest text-[#a8a8a8] uppercase">
                    {isConceptCard ? "METADATA COUTURE" : c.id.toUpperCase()}
                  </h3>
                </div>
                <h4 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight leading-tight uppercase">
                  {c.title}
                </h4>
                <p className="text-xs sm:text-sm font-sans text-neutral-400 mt-2 leading-relaxed font-light">
                  {c.desc}
                </p>
                
                {!isConceptCard && (
                  <div className="mt-4 flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[#a8a8a8] group-hover:text-white transition-colors">
                    {isCategoryActive ? "● ACTIVE FILTER" : "○ CLICK TO DEPLOY FILTER"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
