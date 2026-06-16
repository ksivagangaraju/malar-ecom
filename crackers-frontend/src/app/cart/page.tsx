// src/app/cart/page.tsx

"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";

import { useCartStore } from "../../store/cartStore";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Loader2,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();

  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const subTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,

    0,
  );

  const deliveryCharge = subTotal > 0 ? 150 : 0;

  const finalTotal = subTotal + deliveryCharge;

  const [modal, setModal] = useState({
    show: false,

    type: "error",

    title: "",

    message: "",

    onConfirm: () => {},
  });

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Advanced Pincode Fetching States

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",

    city: "",

    district: "",

    state: "",

    zipCode: "",
  });

  // PINCODE API FETCH LOGIC (India Post API)

  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Only numbers allow cheyadaniki

    const pin = e.target.value.replace(/\D/g, "");

    setShippingAddress((prev) => ({ ...prev, zipCode: pin }));

    // 6 digits type cheyagane API call velthundi

    if (pin.length === 6) {
      setIsFetchingLocation(true);

      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);

        const data = await res.json();

        if (data && data[0].Status === "Success") {
          const postOffices = data[0].PostOffice;

          const fetchedState = postOffices[0].State;

          const fetchedDistrict = postOffices[0].District;

          // Aa pincode kinda unna anni local areas/cities list theeskuntunnam

          const areas = postOffices.map((po: any) => po.Name);

          setAvailableCities(areas);

          setShippingAddress((prev) => ({
            ...prev,

            state: fetchedState,

            district: fetchedDistrict,

            city: areas[0], // Default ga 1st area select chestham
          }));
        } else {
          setAvailableCities([]);

          setShippingAddress((prev) => ({
            ...prev,

            state: "",

            district: "",

            city: "",
          }));

          alert("Invalid PIN Code. Please enter a valid Indian Zip Code.");
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
      } finally {
        setIsFetchingLocation(false);
      }
    } else if (shippingAddress.state) {
      // Pincode erase chesthe paatha data clear avvali

      setAvailableCities([]);

      setShippingAddress((prev) => ({
        ...prev,

        state: "",

        district: "",

        city: "",
      }));
    }
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setModal({
        show: true,

        type: "error",

        title: "Authentication Required",

        message: "Please login to your account to place an order.",

        onConfirm: () => {
          setModal((prev) => ({ ...prev, show: false }));

          router.push("/login");
        },
      });

      return;
    }

    setShowAddressModal(true);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shippingAddress.state ||
      !shippingAddress.district ||
      !shippingAddress.city
    ) {
      alert("Please enter a valid PIN Code to fetch your State and City.");

      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem("token");

    try {
      const formattedItems = items.map((item) => ({
        product: item.id,

        name: item.name,

        quantity: item.quantity,

        price: item.price,
      }));

      const response = await fetch("http://127.0.0.1:5001/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          orderItems: formattedItems,

          shippingAddress: shippingAddress,

          totalAmount: finalTotal,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Backend route '/api/orders' is not connected in your server.ts file!",
        );
      }

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to place order");

      if (data.whatsappRedirectUrl) {
        setShowAddressModal(false);

        setModal({
          show: true,

          type: "success",

          title: "Order Saved!",

          message:
            "Your order details are securely saved. Proceed to WhatsApp to complete the payment.",

          onConfirm: () => {
            window.open(data.whatsappRedirectUrl, "_blank");

            clearCart();

            setModal((prev) => ({ ...prev, show: false }));

            router.push("/catalog");
          },
        });
      } else {
        throw new Error("WhatsApp Redirect URL missing from backend response.");
      }
    } catch (error: any) {
      setShowAddressModal(false);

      setModal({
        show: true,

        type: "error",

        title: "Checkout Failed",

        message: error.message,

        onConfirm: () => setModal((prev) => ({ ...prev, show: false })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] pb-20 relative">
      <Navbar />

      <div className="container mx-auto px-6 pt-10 max-w-6xl">
        <h1 className="text-4xl font-black text-red-900 tracking-tight mb-8 flex items-center gap-3">
          <ShoppingBag className="h-10 w-10 text-amber-500" />
          Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 shadow-sm text-center flex flex-col items-center">
            <div className="bg-amber-100 p-6 rounded-full mb-6">
              <ShoppingBag className="h-16 w-16 text-amber-600" />
            </div>

            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Your cart is empty
            </h2>

            <p className="text-stone-500 mb-8">
              Looks like you haven't added any premium crackers yet.
            </p>

            <Link
              href="/catalog"
              className="bg-gradient-to-r from-red-700 to-red-800 text-white font-bold px-8 py-3 rounded-full hover:shadow-lg transition-transform hover:scale-105"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-grow space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative group"
                >
                  <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-bold text-stone-800 line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-red-700 font-black text-xl mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-stone-100 px-4 py-2 rounded-full border border-stone-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-stone-500 hover:text-red-700 transition"
                    >
                      <Minus className="h-5 w-5" />
                    </button>

                    <span className="font-bold text-lg w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-stone-500 hover:text-green-600 transition"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-right flex flex-col items-center sm:items-end gap-3 min-w-[100px]">
                    <p className="font-bold text-stone-800 text-lg">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-[400px]">
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-lg sticky top-32">
                <h3 className="text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 text-stone-600 font-medium">
                  <div className="flex justify-between">
                    <span>
                      Subtotal (
                      {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      items)
                    </span>

                    <span className="font-bold text-stone-800">
                      ₹{subTotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>

                    <span className="font-bold text-stone-800">
                      ₹{deliveryCharge}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-stone-300 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-stone-800">
                      Total Amount
                    </span>

                    <span className="text-3xl font-black text-red-700">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all flex justify-center items-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {modal.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform transition-all animate-in fade-in zoom-in duration-300">
            <div
              className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${modal.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {modal.type === "success" ? (
                <CheckCircle className="h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10" />
              )}
            </div>

            <h2 className="text-2xl font-black text-stone-800 mb-2 tracking-tight">
              {modal.title}
            </h2>

            <p className="text-stone-500 mb-8 font-medium leading-relaxed">
              {modal.message}
            </p>

            <button
              onClick={modal.onConfirm}
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-md transition duration-200 ${modal.type === "success" ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg"}`}
            >
              {modal.type === "success" ? "Proceed to WhatsApp" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Advanced Auto-Fill Address Modal */}

      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
              <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                <MapPin className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black text-stone-800">
                Shipping Details
              </h2>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Order Flow change: First Pincode adigithe easy ga untundi */}

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-bold text-stone-700 mb-1 flex items-center justify-between">
                  PIN / Zip Code
                  {isFetchingLocation && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" />
                  )}
                </label>

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={shippingAddress.zipCode}
                  onChange={handlePincodeChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none bg-white font-bold tracking-widest"
                  placeholder="Enter 6-digit PIN"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Auto-filled State */}

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    State
                  </label>

                  <input
                    type="text"
                    readOnly
                    required
                    value={shippingAddress.state}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 font-medium cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>

                {/* Auto-filled District */}

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    District
                  </label>

                  <input
                    type="text"
                    readOnly
                    required
                    value={shippingAddress.district}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 font-medium cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>

                {/* City/Area Dropdown (Fetched from Pincode) */}

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    City / Area
                  </label>

                  <select
                    required
                    disabled={availableCities.length === 0}
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,

                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none bg-white text-stone-800 disabled:bg-stone-50 disabled:text-stone-400 font-medium"
                  >
                    <option value="" disabled>
                      {availableCities.length === 0
                        ? "Enter PIN Code first"
                        : "Select your area"}
                    </option>

                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street Address */}

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Street Address
                </label>

                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,

                      street: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none bg-white"
                  placeholder="Door No, Street Name, Landmark"
                />
              </div>

              <div className="pt-5 flex flex-col-reverse sm:grid sm:grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-full font-bold text-stone-500 bg-stone-100 py-3.5 rounded-xl hover:bg-stone-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5 flex-shrink-0" />{" "}
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
