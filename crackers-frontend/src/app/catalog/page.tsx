// src/app/catalog/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import { Grid, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface ProductType {
  _id: string;
  name: string;
  description?: string;
  mrpPrice: number;
  price: number;
  normalSellingPrice: number;
  yourFinalPrice: number;
  images: string[]; // Mee backend array schema prakaram
  stock: number;
  vipMessage?: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCatalogProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        // Token unte pampistham VIP discount calculation kosam
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // FIX: Mee backend route "/all" kabatti URL update chesanu
        const response = await fetch("http://127.0.0.1:5001/api/products/all", {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product catalog from backend.");
        }

        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while loading catalog data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fffdf9] pb-24">
      <Navbar />

      <div className="bg-stone-950 text-white py-16 px-6 border-b border-amber-500/10 mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent)]"></div>
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Exclusive
            Seasonal Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            PREMIUM{" "}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              CATALOG
            </span>
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm md:text-base font-medium tracking-wide">
            Explore our high-tier luxury collection of highly optimized,
            verified secure crackers and vibrant fireworks.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-stone-500">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            <p className="font-bold text-xs uppercase tracking-widest text-stone-400">
              Loading Premium Selection...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl max-w-xl mx-auto flex items-center gap-4 shadow-sm animate-in fade-in duration-200">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="font-black text-base">Catalog Sync Issue</h4>
              <p className="text-sm font-medium opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 border border-dashed border-stone-200 rounded-3xl bg-white p-8 max-w-md mx-auto">
            <Grid className="h-10 w-10 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-800 mb-1">
              No Products Available
            </h3>
            <p className="text-stone-400 text-sm font-medium">
              Seasonal items are being loaded in the server structure tracker.
              Please check back shortly.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.map((prod) => (
              <ProductCard
                key={prod._id}
                id={prod._id}
                name={prod.name}
                description={prod.description}
                mrpPrice={prod.mrpPrice}
                normalSellingPrice={prod.normalSellingPrice}
                yourFinalPrice={prod.yourFinalPrice}
                images={prod.images} // Mee backend data exact matching
                stock={prod.stock}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
