"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "stats" | "add_product" | "orders"
  >("stats");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New Product Form State
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    images: "",
    mrpPrice: "",
    sellingPrice: "",
    stock: "",
    category: "crackers",
  });

  useEffect(() => {
    // Admin kadakapothe Home page ki pampinchestam
    if (user && user.role !== "admin") {
      router.push("/");
    } else if (user && token) {
      fetchStats();
      fetchOrders();
    }
  }, [user, token, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/admin/dashboard-stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) setStats(await res.json());
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = {
        ...productData,
        images: [productData.images], // URL ni array format loki marustunnam
        mrpPrice: Number(productData.mrpPrice),
        sellingPrice: Number(productData.sellingPrice),
        stock: Number(productData.stock),
      };

      const res = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        alert("✅ Product Added Successfully!");
        setProductData({
          name: "",
          description: "",
          images: "",
          mrpPrice: "",
          sellingPrice: "",
          stock: "",
          category: "crackers",
        });
        fetchStats(); // Stats update avvadaniki
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin")
    return (
      <div className="text-center py-20 text-xl font-bold">
        Access Denied ❌
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-2xl font-black text-red-600 mb-6 border-b pb-4">
          Admin Panel
        </h2>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => setActiveTab("stats")}
            className={`text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === "stats" ? "bg-red-50 text-red-600" : "hover:bg-gray-50"}`}
          >
            📊 Dashboard Stats
          </button>
          <button
            onClick={() => setActiveTab("add_product")}
            className={`text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === "add_product" ? "bg-red-50 text-red-600" : "hover:bg-gray-50"}`}
          >
            📦 Add New Product
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === "orders" ? "bg-red-50 text-red-600" : "hover:bg-gray-50"}`}
          >
            📋 Manage Orders
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Business Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <p className="text-red-500 font-bold text-sm uppercase">
                  Total Revenue
                </p>
                <p className="text-3xl font-black text-gray-800 mt-2">
                  ₹{stats.totalRevenue}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-500 font-bold text-sm uppercase">
                  Total Orders
                </p>
                <p className="text-3xl font-black text-gray-800 mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <p className="text-green-500 font-bold text-sm uppercase">
                  Total Customers
                </p>
                <p className="text-3xl font-black text-gray-800 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <p className="text-yellow-600 font-bold text-sm uppercase">
                  Total Products
                </p>
                <p className="text-3xl font-black text-gray-800 mt-2">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === "add_product" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Add Premium Cracker
            </h3>
            <form
              onSubmit={handleAddProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  MRP Price (₹)
                </label>
                <input
                  type="number"
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none"
                  value={productData.mrpPrice}
                  onChange={(e) =>
                    setProductData({ ...productData, mrpPrice: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none"
                  value={productData.sellingPrice}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      sellingPrice: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Available Stock
                </label>
                <input
                  type="number"
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none"
                  value={productData.stock}
                  onChange={(e) =>
                    setProductData({ ...productData, stock: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none"
                  value={productData.category}
                  onChange={(e) =>
                    setProductData({ ...productData, category: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-red-500 outline-none"
                  value={productData.images}
                  onChange={(e) =>
                    setProductData({ ...productData, images: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Adding Product..." : "Publish Product 🚀"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Recent Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="p-4 border-b">Order ID</th>
                    <th className="p-4 border-b">Customer</th>
                    <th className="p-4 border-b">Amount</th>
                    <th className="p-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition border-b border-gray-100"
                    >
                      <td className="p-4 text-sm text-gray-500">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        {order.user?.name || "Unknown"}
                      </td>
                      <td className="p-4 font-bold text-green-600">
                        ₹{order.finalAmount}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "purchased" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
