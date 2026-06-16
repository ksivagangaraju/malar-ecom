"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyOrdersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (token) {
      fetchMyOrders();
    }
  }, [user, token, router]);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("My Orders Data:", data);
        setOrders(data);
      } else {
        const errorData = await res.json();
        alert(`Error fetching orders: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const ADMIN_PHONE = process.env.ADMIN_WHATSAPP_NUMBER || "917013090217";

  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const textMessage = `⚠️ Hello Admin, I have cancelled my order.\n\n*Order ID:* ${orderId}\n*Customer Name:* ${user?.name}\n\nPlease check and update the status.`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_PHONE}&text=${encodeURIComponent(textMessage)}`;

        alert("Order Cancelled. Redirecting to WhatsApp to notify Admin.");

        window.open(whatsappUrl, "_blank");

        fetchMyOrders();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Server error while cancelling the order.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-bold text-gray-500">
        Loading your orders... 📦
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-black text-gray-800 mb-8 border-b pb-4">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Start Shopping 🎆
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Order ID:{" "}
                  <span className="text-gray-800 font-bold">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Placed On:{" "}
                  <span className="text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>

                <div className="mt-4">
                  <p className="font-bold text-gray-800 mb-1">Items:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {order.items.map((item: any, index: number) => (
                      <li key={index}>
                        {item.name} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-4 md:mt-0 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-black text-green-600 mb-3">
                  ₹{order.finalAmount}
                </p>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold mb-4 ${
                    order.status === "purchased"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>

                {/* Status pending leda purchased unte ne cancel option chupistam */}
                {(order.status === "pending" ||
                  order.status === "purchased") && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="w-full text-red-600 border border-red-200 bg-white hover:bg-red-50 font-bold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Cancel Order ❌
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
