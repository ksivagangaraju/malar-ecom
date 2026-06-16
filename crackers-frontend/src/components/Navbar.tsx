// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Sparkles,
  PhoneCall,
  LogOut,
  Menu,
  X,
  Home,
  Grid,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (token) {
      setIsLoggedIn(true);
      if (name) {
        setUserName(name.split(" ")[0]);
      }
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-stone-950/95 backdrop-blur-md border-b border-amber-500/20 text-stone-100 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Container Wrapper */}
      <div className="container mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
        {/* Luxury Metallic Gold Gradient Logo */}
        <Link href="/" className="flex items-center space-x-2 group shrink-0">
          <div className="relative">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
              Malar
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-[0.25em] text-stone-400 -mt-1 block">
              Premium Crackers
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION LINKS --- */}
        <div className="hidden md:flex items-center space-x-10 font-bold text-xs uppercase tracking-[0.2em] text-stone-300">
          <Link
            href="/"
            className={`hover:text-amber-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-400 after:transition-all duration-300 ${pathname === "/" ? "text-amber-400 after:w-full" : "after:w-0 hover:after:w-full"}`}
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className={`hover:text-amber-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-amber-400 after:transition-all duration-300 ${pathname === "/catalog" ? "text-amber-400 after:w-full" : "after:w-0 hover:after:w-full"}`}
          >
            Catalog
          </Link>
          <Link
            href="/contact"
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <PhoneCall className="h-3.5 w-3.5 text-amber-400" /> Support
          </Link>
        </div>

        {/* --- DESKTOP ACTION CONTROLS --- */}
        <div className="hidden md:flex items-center space-x-6 shrink-0">
          {/* Luxury Cart Button */}
          <Link
            href="/cart"
            className="relative p-2.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 rounded-xl transition duration-300 group shadow-inner"
          >
            <ShoppingCart className="h-5 w-5 text-amber-400 group-hover:scale-105 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-[10px] h-5 w-5 rounded-md flex items-center justify-center shadow-lg border border-red-500 animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Profile Premium Widget */}
          {isLoggedIn ? (
            <div className="flex items-center bg-stone-900 border border-amber-500/30 pl-3 pr-1.5 py-1 rounded-xl gap-3 shadow-md">
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:opacity-80 transition cursor-pointer"
              >
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-1.5 rounded-lg text-stone-950">
                  <User className="h-4 w-4 font-black" />
                </div>
                <span className="text-sm font-black tracking-wide text-stone-200">
                  {userName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-stone-800 hover:bg-red-950 border border-stone-700 hover:border-red-800 p-2 rounded-lg text-stone-400 hover:text-red-400 transition-all duration-200 group"
                title="Logout Account"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(245,158,11,0.25)]"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* --- MOBILE ACTION MODULES --- */}
        <div className="md:hidden flex items-center gap-3 shrink-0">
          {/* Mobile Cart Option */}
          <Link
            href="/cart"
            className="relative p-2.5 bg-stone-900 border border-stone-800 rounded-xl transition duration-200"
          >
            <ShoppingCart className="h-5 w-5 text-amber-400" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[9px] h-4 w-4 rounded-md flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Premium Modern Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-stone-900 border border-stone-800 text-amber-400 rounded-xl active:scale-95 transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE SLIDING MENU DROPDOWN --- */}
      <div
        className={`md:hidden absolute w-full bg-stone-950/98 backdrop-blur-lg border-b border-amber-500/20 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 py-6 flex flex-col space-y-4">
          {/* Dynamic Mobile Profile Header */}
          {isLoggedIn && (
            <Link href="/profile">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-2.5 rounded-xl text-stone-950">
                  <User className="h-5 w-5 font-bold" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-medium">
                    Verified VIP Account
                  </p>
                  <p className="text-lg font-black text-amber-400 tracking-wide">
                    {userName}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Mobile Internal Links */}
          <Link
            href="/"
            className="flex items-center gap-3.5 text-base font-bold text-stone-200 hover:text-amber-400 transition py-1"
          >
            <Home className="h-4 w-4 text-amber-400" /> Home
          </Link>
          <Link
            href="/catalog"
            className="flex items-center gap-3.5 text-base font-bold text-stone-200 hover:text-amber-400 transition py-1"
          >
            <Grid className="h-4 w-4 text-amber-400" /> Catalog Collection
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-between text-base font-bold text-stone-200 hover:text-amber-400 transition py-1"
          >
            <div className="flex items-center gap-3.5">
              <ShoppingCart className="h-4 w-4 text-amber-400" /> Shopping Cart
            </div>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black px-2.5 py-0.5 rounded-lg text-xs">
              {totalItems} Items
            </span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3.5 text-base font-bold text-stone-200 hover:text-amber-400 transition py-1"
          >
            <PhoneCall className="h-4 w-4 text-amber-400" /> Customer Care
          </Link>

          {/* Mobile Auth Button Setup */}
          <div className="pt-4 border-t border-stone-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex justify-center items-center gap-2 bg-stone-900 border border-red-900/50 hover:bg-red-950/30 text-red-400 py-3 rounded-xl font-bold transition w-full text-sm tracking-wide"
              >
                <LogOut className="h-4 w-4" /> Sign Out from Device
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex justify-center items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg"
                >
                  <User className="h-4 w-4" /> Login to Account
                </Link>
                <Link
                  href="/signup"
                  className="text-center text-xs text-stone-400 hover:text-amber-400 pt-2 font-semibold tracking-wide"
                >
                  Don't have an account? Create Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
