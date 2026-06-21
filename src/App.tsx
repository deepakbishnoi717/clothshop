import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, ShieldCheck, ArrowRight, Smartphone, 
  Instagram, Facebook, MessageSquare, RefreshCw, AlertCircle, ShoppingBag, Terminal
} from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TheCollection from "./components/TheCollection";
import NewArrivals from "./components/NewArrivals";
import ProductCard from "./components/ProductCard";
import MembershipForm from "./components/MembershipForm";
import StylistWidget from "./components/StylistWidget";
import AuthModal from "./components/AuthModal";
import { ToastProvider, useToast } from "./components/Toast";
import MagneticButton from "./components/MagneticButton";
import { CATEGORY_FILTERS, INSTAGRAM_POSTS } from "./data";
import { Product, User } from "./types";

const queryClient = new QueryClient();

function MainBoutiqueApp() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const toast = useToast();

  // Validate active JWT session on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("vip_jwt_token");
    if (savedToken) {
      setJwtToken(savedToken);
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Stale token");
        })
        .then((data) => {
          setCurrentUser(data.user);
          toast.showToast(`Elite access profile key verified for ${data.user.name}.`, "success");
        })
        .catch(() => {
          // Clean stale session
          localStorage.removeItem("vip_jwt_token");
          setJwtToken(null);
        });
    }
  }, []);

  // Use TanStack Query for efficient server state caching and data fetching of menswear products
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shop_products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Unable to fetch boutique items catalog");
      }
      const payload = await res.json();
      return payload.products as Product[];
    }
  });

  const handleAuthSuccess = (token: string, user: User) => {
    setJwtToken(token);
    setCurrentUser(user);
    localStorage.setItem("vip_jwt_token", token);
  };

  const handleLogout = () => {
    setJwtToken(null);
    setCurrentUser(null);
    localStorage.removeItem("vip_jwt_token");
    toast.showToast("VIP session signed off. Guest mode restored.", "info");
  };

  // Scroll coordinators
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle high-end attribution toast notification of unrequested/placeholder elements
  const handleNonFunctionalBtnClick = () => {
    toast.showDefaultToast();
  };

  // Filter products by selected categories
  const filteredProducts = (data || []).filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white font-sans antialiased">
      
      {/* 1. Frosted Navigation bar */}
      <Navbar
        isLoggedIn={!!currentUser}
        username={currentUser?.name}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onScrollToVIP={() => scrollToSection("vip-section")}
        onScrollToCatalog={() => scrollToSection("shop-collection-section")}
      />

      {/* 2. Interactive Centered Hero Section */}
      <Hero
        onJoinVIPClick={() => scrollToSection("vip-section")}
        onBrowseCollectionClick={() => scrollToSection("shop-collection-section")}
        isLoggedIn={!!currentUser}
        username={currentUser?.name}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />

      {/* 3. Bento Mesh Category Grid section */}
      <TheCollection
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* 4. Horizontal Scrolling Kinetic Runway (New Arrivals) */}
      {!isLoading && !isError && data && (
        <NewArrivals
          products={data.slice(0, 4)} // Showing the four newest arrivals
          onProductClick={(p) => {
            scrollToSection("shop-collection-section");
            toast.showToast(`Inspecting spec specifications for ${p.name}`, "info");
          }}
        />
      )}

      {/* 5. Main Catalog Showcase Section (Interactive Shop) */}
      <section id="shop-collection-section" className="relative min-h-screen bg-[#050505] py-24 px-4 sm:px-8 border-b border-neutral-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-1.5 text-blue-500 font-mono text-[10px] tracking-widest uppercase mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                <span>INTERACTIVE BOUTIQUE PORTAL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight uppercase">
                THE CATALOGUE
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 text-[10px] font-mono tracking-widest transition-all rounded-md cursor-pointer border ${
                    selectedCategory === cat.value
                      ? "bg-white border-transparent text-black font-semibold shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                      : "bg-[#0b0b0e] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fallback states & Loader for TanStack Query state */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 space-y-4"
              >
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="font-mono text-xs text-[#a8a8a8] tracking-widest uppercase">FETCHING COUTURE SHELVES...</p>
              </motion.div>
            )}

            {isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto space-y-4"
              >
                <div className="w-12 h-12 bg-red-950/20 border border-red-800 rounded-full flex items-center justify-center text-red-400">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-mono tracking-widest text-neutral-300 uppercase">CATALOGUE OFFLINE</h3>
                <p className="text-xs font-sans text-neutral-500 leading-relaxed font-light">
                  Our core database endpoints are currently undergoing an automated clearance. Tap below to retry core telemetry.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2 border border-neutral-800 text-[10px] text-blue-500 hover:text-white hover:bg-white/5 font-mono tracking-widest uppercase rounded-sm cursor-pointer"
                >
                  RECONNECT DATA CORE
                </button>
              </motion.div>
            )}

            {!isLoading && !isError && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 space-y-3"
              >
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">No garments match the designated specifications filter.</p>
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className="text-xs font-sans font-bold text-blue-500 hover:text-white"
                >
                  View All Items
                </button>
              </motion.div>
            )}

            {!isLoading && !isError && filteredProducts.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
              >
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    userEmail={currentUser?.email}
                    isLoggedIn={!!currentUser}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 6. VIP Membership Dark Form Capturer */}
      <MembershipForm
        onSuccess={handleAuthSuccess}
        isLoggedIn={!!currentUser}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* 7. Beautiful Social Connection & Footer info */}
      <footer className="relative bg-[#020202] py-16 px-6 sm:px-12 border-t border-neutral-900/60 font-sans">
        
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-neutral-900/60">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-lg font-sans font-bold tracking-[0.4em] text-white">[ S H O P &nbsp; N A M E ]</span>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              High-fashion 'Noir' menswear boutique engineered with architectural geometries, matte finishes, and cyber-performance capabilities.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open("https://instagram.com", "_blank")}
                className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                aria-label="Instagram Link"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.open("https://facebook.com", "_blank")}
                className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                aria-label="Facebook Link"
              >
                <Facebook className="w-4 h-4 animate-none" />
              </button>
              <button
                onClick={() => window.open("https://wa.me/15550199", "_blank")}
                className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                aria-label="WhatsApp Link"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-[10px] font-mono tracking-widest text-[#a8a8a8] uppercase">CORE METADATA</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={handleNonFunctionalBtnClick} className="hover:text-blue-400 font-light transition-colors text-left cursor-pointer">
                  Sartorial Specifications
                </button>
              </li>
              <li>
                <button onClick={handleNonFunctionalBtnClick} className="hover:text-blue-400 font-light transition-colors text-left cursor-pointer">
                  Archival Materials
                </button>
              </li>
              <li>
                <button onClick={handleNonFunctionalBtnClick} className="hover:text-blue-400 font-light transition-colors text-left cursor-pointer">
                  VIP Security Handshakes
                </button>
              </li>
            </ul>
          </div>

          {/* Location details */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-[10px] font-mono tracking-widest text-[#a8a8a8] uppercase">CHAMBERS</h4>
            <div className="space-y-1.5 text-xs text-neutral-400 font-light">
              <p>Chamber 01: Aoyama, Tokyo, JP</p>
              <p>Chamber 02: Saint-Germain, Paris, FR</p>
              <p>Chamber 03: Mayfair, London, UK</p>
            </div>
          </div>

          {/* Custom telemetry indicator */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-500 uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>CORE STATUS</span>
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-900 font-mono text-[9px] text-[#a8a8a8] leading-normal uppercase">
              SECTIONS: ENGAGED<br />
              JWT_CORE: ONLINE<br />
              N8N_PULS: WAITING
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center sm:justify-between text-[10px] font-mono text-neutral-500 gap-4 uppercase tracking-widest text-center sm:text-left">
          <span>
            © 2026 [SHOP NAME] SPECIAL PRIVATE ATELIER CORP. ALL RIGHTS SECURITY VERIFIED.
          </span>
          <button
            onClick={handleNonFunctionalBtnClick}
            className="hover:text-white transition-colors cursor-pointer text-neutral-500 hover:underline"
          >
            TERMS & SIGNALS
          </button>
        </div>

      </footer>

      {/* 8. Floating Personal AI Stylist Bot Chatbot */}
      <StylistWidget
        isLoggedIn={!!currentUser}
        username={currentUser?.name}
      />

      {/* 9. VIP JWT Auth and Verification Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MainBoutiqueApp />
      </ToastProvider>
    </QueryClientProvider>
  );
}
