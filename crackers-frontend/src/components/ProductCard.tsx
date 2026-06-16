// src/components/ProductCard.tsx
"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShoppingCart,
  Star,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";

interface ProductProps {
  id: string;
  name: string;
  description?: string;
  mrpPrice: number;
  normalSellingPrice: number;
  yourFinalPrice: number;
  image?: string;
  images?: string[];
  stock: number;
}

export default function ProductCard({
  id,
  name,
  description,
  mrpPrice,
  normalSellingPrice,
  yourFinalPrice,
  images,
  stock,
}: ProductProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Client-side rendering sync (React Portal kosam)
  useEffect(() => {
    setMounted(true);
  }, []);

  const fallbackImage =
    "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=600&q=80";

  // Explicit ga Idi String Array ani chebuthunnam
  const productImages: string[] =
    images && images.length > 0 ? images : [fallbackImage];

  // 100% ERROR FIX: Idi single image URL string. Ekkada array velladu.
  const displayImage: string = productImages[0];

  const isDiscountApplied = yourFinalPrice < normalSellingPrice;
  const isStockAvailable = stock > 0;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  };

  // Add to Cart Handlers (Ikkada displayImage string vaadutunnam, so TS error raadu)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      id: id,
      name: name,
      price: yourFinalPrice,
      quantity: 1,
      image: displayImage,
    });
  };

  const handleModalAddToCart = () => {
    addToCart({
      id: id,
      name: name,
      price: yourFinalPrice,
      quantity: 1,
      image: displayImage,
    });
    setIsModalOpen(false);
  };

  // Modal Content Layout (Images load ayyaka proper ga expand avuthundi)
  const modalContent = (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
          className="absolute top-4 right-4 z-50 bg-stone-900 text-amber-400 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Left: Image Area */}
        <div className="md:w-1/2 bg-stone-50 relative group flex flex-col border-r border-stone-100">
          <div className="relative h-64 md:h-full min-h-[350px] w-full flex items-center justify-center bg-stone-50">
            {/* Modal Loni Image string index tho map avuthundi */}
            <img
              src={productImages[currentImageIndex]}
              alt={name}
              className="max-h-full max-w-full object-contain p-6 mix-blend-multiply"
            />

            {productImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 p-2 bg-white border border-stone-200 text-stone-800 rounded-xl shadow-md hover:bg-stone-50 transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 p-2 bg-white border border-stone-200 text-stone-800 rounded-xl shadow-md hover:bg-stone-50 transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t border-stone-100">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? "border-amber-500 shadow-md p-0.5" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover rounded-lg"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Right: Data Area */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-4">
            {isStockAvailable ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-md">
                <CheckCircle className="h-3.5 w-3.5" /> Direct Stock
                Verification Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1 rounded-md">
                <X className="h-3.5 w-3.5" /> Out of Stock Seasonal Wait
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight mb-2 tracking-tight">
            {name}
          </h2>

          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-stone-400 font-bold ml-2">
              Premium Festive Choice
            </span>
          </div>

          <div className="mb-6 bg-stone-50 p-5 rounded-2xl border border-stone-100">
            <span className="text-xs font-bold text-stone-400 line-through block mb-0.5">
              Standard MRP: ₹{mrpPrice}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-red-700">
                ₹{yourFinalPrice}
              </span>
              {isDiscountApplied && (
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  VIP Special Rate Applied
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-stone-800 text-sm mb-1.5 uppercase tracking-wider">
              Product Overview
            </h4>
            <p className="text-stone-500 leading-relaxed text-sm">
              {description
                ? description
                : "Experience the vibrant colors and mesmerizing effects of our premium crackers. Crafted with precision and safety, these festive essentials are designed to light up your celebrations with joy and wonder."}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-stone-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalAddToCart();
              }}
              disabled={!isStockAvailable}
              className={`w-full py-4 rounded-xl font-black text-base flex justify-center items-center gap-3 transition-all shadow-md ${isStockAvailable ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 hover:shadow-xl hover:scale-[1.01]" : "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200 shadow-none"}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {isStockAvailable
                ? "Add to Shopping Cart"
                : "Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Product Card Outer Grid */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-2xl border border-amber-500/20 overflow-hidden hover:shadow-[0_10px_40px_rgba(245,158,11,0.15)] transition-all duration-300 group flex flex-col cursor-pointer relative"
      >
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-stone-950 text-amber-400 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl border border-amber-500/30 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="h-4 w-4" /> Quick View
          </div>
        </div>

        {/* IKKADA SINGLE STRING IMAGE MATHRAME VELLALANI FIX CHESAM */}
        <div className="h-56 relative overflow-hidden bg-stone-100 flex items-center justify-center">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {isStockAvailable ? (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-md z-10">
              IN STOCK
            </div>
          ) : (
            <div className="absolute top-3 left-3 bg-stone-800 text-stone-400 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-md z-10">
              OUT OF STOCK
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow z-10 bg-white">
          <h3 className="text-lg font-black text-stone-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
            {name}
          </h3>

          <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-end">
            <div>
              <p className="text-xs text-stone-400 line-through font-bold">
                MRP: ₹{mrpPrice}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-red-700">
                  ₹{yourFinalPrice}
                </p>
                {isDiscountApplied && (
                  <span className="bg-amber-400/10 text-amber-600 text-[9px] font-black px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                    VIP GOLD
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isStockAvailable}
              className={`p-3 rounded-xl transition-all duration-200 z-30 relative ${isStockAvailable ? "bg-stone-950 text-amber-400 hover:bg-amber-400 hover:text-stone-950 border border-amber-500/30 shadow-md active:scale-95" : "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PORTAL RENDER: Modal screen ni perfect ga center chestundi */}
      {mounted && isModalOpen && createPortal(modalContent, document.body)}
    </>
  );
}
