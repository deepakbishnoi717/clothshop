import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, MessageSquare, Check, RefreshCw, Smartphone } from "lucide-react";
import { Product } from "../types";
import { useToast } from "./Toast";
import MagneticButton from "./MagneticButton";

interface ProductCardProps {
  key?: string;
  product: Product;
  userEmail?: string;
  isLoggedIn?: boolean;
}

export default function ProductCard({ product, userEmail, isLoggedIn }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);
  const toast = useToast();

  const handleFlipToggle = () => {
    setIsFlipped(!isFlipped);
    setCheckSuccess(false);
  };

  const handleCheckStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      toast.showToast("Please select a size to check stock", "error");
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch("/api/webhook/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          size: selectedSize,
          whatsapp: whatsappNumber || "VIP Member Saved"
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCheckSuccess(true);
        toast.showToast(`Stock query for size ${selectedSize} dispatched successfully!`, "success");
      } else {
        toast.showToast(data.error || "Failed checking stock", "error");
      }
    } catch (err: any) {
      toast.showToast("Connection to stock server failed", "error");
    } finally {
      setIsChecking(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!selectedSize) {
      toast.showToast("Please choose a size first", "error");
      return;
    }
    // Deep link redirect
    const textStr = `Hello, I would like to check availability for ${product.name} in size ${selectedSize} (Price: ${product.price}).`;
    const targetUrl = `https://wa.me/15550199?text=${encodeURIComponent(textStr)}`;
    window.open(targetUrl, "_blank");
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative h-[450px] w-full cursor-pointer perspective-[1200px]"
    >
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-700 ease-out preserve-3d shadow-2xl ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 h-full w-full rounded-2xl border border-neutral-800 bg-neutral-950/60 backdrop-blur-md backface-hidden overflow-hidden flex flex-col justify-between p-4">
          
          {/* Header Actions */}
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#a8a8a8] border border-neutral-800 px-2.5 py-1 rounded-full bg-black/40">
              {product.category.toUpperCase()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFlipToggle();
              }}
              className="p-2 rounded-full cursor-pointer bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-blue-500 transition-all glow-blue-sm"
              title="View product details & sizes"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Product High-Res Shot */}
          <div className="absolute inset-0 w-full h-3/4 overflow-hidden -z-10 group-hover:scale-105 transition-transform duration-700 ease-out">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-500"
            />
            {/* Matte Fade Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          </div>

          {/* Bottom Info Details */}
          <div className="mt-auto pt-4 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent relative z-10">
            <h3 className="text-lg font-sans font-medium tracking-tight text-white leading-tight">
              {product.name}
            </h3>
            <div className="flex justify-between items-center mt-2.5">
              <span className="text-xl font-mono font-semibold text-white tracking-wide">
                {product.price}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                product.countInStock > 0 ? "text-blue-400" : "text-neutral-500"
              }`}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : "Out of Stock"}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFlipToggle();
              }}
              className="w-full mt-4 py-2.5 rounded-lg font-mono text-[11px] tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors uppercase cursor-pointer"
            >
              INTERACTIVE SPECIFICATIONS & STOCK
            </button>
          </div>
        </div>

        {/* BACK SIDE (Flipped details) */}
        <div className="absolute inset-0 h-full w-full rounded-2xl border border-neutral-800 bg-[#070707] backface-hidden rotate-y-180 p-5 flex flex-col justify-between overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-neutral-800/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Specifications</span>
              <h4 className="text-sm font-sans font-medium text-white truncate max-w-[160px]">{product.name}</h4>
            </div>
            <button
              onClick={handleFlipToggle}
              className="p-1.5 rounded-full cursor-pointer bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Specifications Content */}
          <div className="my-4 space-y-3.5 flex-grow">
            <p className="text-xs font-sans text-neutral-400 leading-relaxed">
              {product.description}
            </p>
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 tracking-wider">AVAILABLE SIZES</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`min-w-10 h-8 rounded border text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${
                      selectedSize === size
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-mono text-neutral-500 tracking-wider">PRICE</span>
              <span className="text-base font-mono font-bold text-white">{product.price}</span>
            </div>
          </div>

          {/* Webhook Stock Check Form */}
          <form onSubmit={(e) => { e.stopPropagation(); handleCheckStock(e); }} className="space-y-3 pt-2 border-t border-neutral-800/60">
            {!isLoggedIn && (
              <div className="relative">
                <Smartphone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="WhatsApp Number (optional)"
                  value={whatsappNumber}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-8 pr-3 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-blue-500 font-mono transition-all"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                disabled={isChecking}
                className="w-full h-10 rounded-lg text-[10px] font-mono tracking-widest transition-all bg-neutral-900 border border-neutral-800 text-blue-400 hover:bg-neutral-800 hover:text-blue-300 uppercase cursor-pointer flex items-center justify-center gap-1"
              >
                {isChecking ? "Checking..." : checkSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Verified
                  </>
                ) : "Query n8n"}
              </button>

              <MagneticButton
                onClick={handleWhatsAppRedirect}
                className="w-full h-10 rounded-lg text-[10px] font-mono tracking-widest text-black bg-white border border-transparent hover:bg-[#25D366] hover:text-black uppercase cursor-pointer"
              >
                <span className="flex items-center justify-center gap-1 text-[10px]">
                  <MessageSquare className="w-3 w-3" /> WhatsApp
                </span>
              </MagneticButton>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
