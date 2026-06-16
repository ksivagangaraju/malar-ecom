// src/app/page.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  // Image load state tracking
  const [isLoaded, setIsLoaded] = useState(false);

  // Meeru pampina image lanti royalty-free URL idhi.
  // (Mee swantha image public folder lo pedithe, e.g., "/fireworks.jpg" ani marchandi)
  const highResImage =
    "https://images.pexels.com/photos/31210646/pexels-photo-31210646.jpeg?q=80&w=2500&auto=format&fit=crop";
  const tinyBlurImage =
    "https://images.pexels.com/photos/31210646/pexels-photo-31210646.jpeg?q=10&w=50&auto=format&fit=crop";

  return (
    <main className="relative min-h-screen flex flex-col bg-stone-950 overflow-hidden">
      {/* --- PROGRESSIVE BACKGROUND LOADER --- */}
      <div className="absolute inset-0 z-0">
        {/* 1. Blurred Placeholder (Loads Instantly) */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            isLoaded ? "opacity-0" : "opacity-50 blur-2xl scale-110"
          }`}
          style={{ backgroundImage: `url(${tinyBlurImage})` }}
        />

        {/* 2. High Quality Image (Fades in smoothly) */}
        <Image
          src={highResImage}
          alt="Malar Crackers Premium Fireworks"
          fill
          priority
          className={`object-cover transition-opacity duration-[1.5s] ease-in-out ${
            isLoaded ? "opacity-50" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />

        {/* 3. Dark Gradient Overlay (Text clear ga kanipinchadaniki) */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-stone-950/95" />
      </div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <div className="flex-grow flex flex-col items-center justify-center px-6 text-center -mt-20">
          <span className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-4 w-4 animate-pulse" /> Light Up Your
            Celebrations
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 drop-shadow-2xl">
            PREMIUM{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
              FIREWORKS
            </span>
          </h1>

          <p className="text-stone-300 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 drop-shadow-md">
            Experience the magic with our high-tier luxury collection of highly
            optimized, verified secure crackers. Safe, vibrant, and perfectly
            crafted for your grand events.
          </p>

          <Link
            href="/catalog"
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-black text-lg px-8 py-4 rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative">Explore Collection</span>
            <ArrowRight className="relative h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
