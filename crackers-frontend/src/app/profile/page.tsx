// src/app/profile/page.tsx

"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";

import {
  User,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  Loader2,
  LogOut,
} from "lucide-react";

// Types mapping (Mee Backend Schema Prakaram)

interface UserProfile {
  _id: string;

  name: string;

  email: string;

  phone: string;

  role: string;

  isVipGold: boolean;

  createdAt: string;
}

interface OrderItem {
  _id: string;

  name: string;

  quantity: number;

  price: number;
}

interface OrderType {
  _id: string;

  orderItems: OrderItem[];

  totalAmount: number;

  orderStatus: string;

  createdAt: string;

  shippingAddress: {
    street: string;

    city: string;

    state: string;

    zipCode: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "orders">("orders");

  const [user, setUser] = useState<UserProfile | null>(null);

  const [orders, setOrders] = useState<OrderType[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");

        return;
      }

      try {
        const headers = {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        };

        // 1. Fetch Profile

        const profileRes = await fetch(
          "http://127.0.0.1:5001/api/auth/profile",

          { headers },
        );

        if (!profileRes.ok) throw new Error("Failed to load profile");

        const profileData = await profileRes.json();

        setUser(profileData);

        // 2. Fetch Orders

        const ordersRes = await fetch(
          "http://127.0.0.1:5001/api/orders/myorders",

          { headers },
        );

        if (!ordersRes.ok) throw new Error("Failed to load orders");

        const ordersData = await ordersRes.json();

        setOrders(ordersData);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userName");

    router.push("/login");
  };

  // Status color mapper

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "text-amber-600 bg-amber-50 border-amber-200";

      case "Confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";

      case "Delivered":
        return "text-green-600 bg-green-50 border-green-200";

      case "Cancelled":
        return "text-red-600 bg-red-50 border-red-200";

      default:
        return "text-stone-600 bg-stone-50 border-stone-200";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf9]">
        <Navbar />

        <div className="flex flex-col items-center justify-center pt-32 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />

          <p className="font-bold text-stone-500 uppercase tracking-widest text-sm">
            Loading Your Workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] pb-20">
      <Navbar />

      <div className="bg-stone-950 text-white pt-12 pb-24 px-6 border-b border-amber-500/20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent)]"></div>

        <div className="container mx-auto max-w-5xl relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-black text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {user?.name.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
                {user?.name}
              </h1>

              <p className="text-stone-400 font-medium">{user?.email}</p>

              {user?.isVipGold && (
                <span className="inline-block mt-2 bg-amber-400/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                  VIP Gold Member
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
          >
            <LogOut className="h-4 w-4" /> Secure Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 -mt-10 relative z-20">
        {/* Navigation Tabs */}

        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-md border border-stone-100 mb-8 max-w-sm mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "orders" ? "bg-stone-900 text-amber-400 shadow-md" : "text-stone-500 hover:bg-stone-50"}`}
          >
            <Package className="h-4 w-4" /> My Orders
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "profile" ? "bg-stone-900 text-amber-400 shadow-md" : "text-stone-500 hover:bg-stone-50"}`}
          >
            <User className="h-4 w-4" /> Profile Info
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 font-medium border border-red-200">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {/* PROFILE TAB */}

        {activeTab === "profile" && user && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-stone-800 mb-6 flex items-center gap-3">
              <User className="text-amber-500" /> Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Full Name
                </label>

                <p className="text-lg font-bold text-stone-800">{user.name}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Email Address
                </label>

                <p className="text-lg font-bold text-stone-800">{user.email}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Phone Number
                </label>

                <p className="text-lg font-bold text-stone-800">{user.phone}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Account Status
                </label>

                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />

                  <span className="font-bold text-stone-800">
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}

        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-300">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-stone-200">
                <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  No Orders Yet
                </h3>

                <p className="text-stone-500 mb-6">
                  Looks like you haven't placed any premium cracker orders.
                </p>

                <button
                  onClick={() => router.push("/catalog")}
                  className="bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold px-8 py-3 rounded-xl transition-all shadow-md"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-100 pb-5 mb-5 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
                            Order ID
                          </span>

                          <span className="text-sm font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
                          <Clock className="h-4 w-4" />

                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",

                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </div>
                      </div>

                      <div
                        className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest flex items-center gap-2 w-max ${getStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus === "Cancelled" ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}

                        {order.orderStatus}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                          Items Summary
                        </h4>

                        <div className="space-y-3">
                          {order.orderItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100"
                            >
                              <span className="font-bold text-stone-700 text-sm">
                                {item.quantity}x {item.name}
                              </span>

                              <span className="font-black text-stone-900 text-sm">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Shipping Details
                        </h4>

                        <p className="text-sm font-medium text-stone-700 mb-6 leading-relaxed">
                          {order.shippingAddress.street},<br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                          <br />
                          PIN: {order.shippingAddress.zipCode}
                        </p>

                        <div className="pt-4 border-t border-stone-200 flex justify-between items-end">
                          <span className="text-sm font-bold text-stone-500">
                            Total Paid
                          </span>

                          <span className="text-2xl font-black text-red-700">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
