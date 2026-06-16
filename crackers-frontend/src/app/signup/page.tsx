// src/app/signup/page.tsx

"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";

import {
  UserPlus,
  Loader2,
  MailCheck,
  CheckCircle,
  XCircle,
  Calendar, // Kothaga add chesam
  Users, // Kothaga add chesam
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",

    email: "",

    phone: "",

    password: "",

    otp: "",

    dob: "", // Kothaga add chesam

    gender: "", // Kothaga add chesam
  });

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    show: false,

    type: "success",

    title: "",

    message: "",

    onConfirm: () => {},
  });

  // Step 1: Request OTP

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/send-otp", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setModal({
        show: true,

        type: "success",

        title: "OTP Sent Successfully!",

        message: `A 6-digit verification code has been dispatched to ${formData.email}. Please check your inbox.`,

        onConfirm: () => {
          setModal((prev) => ({ ...prev, show: false }));

          setStep(2);
        },
      });
    } catch (err: any) {
      setModal({
        show: true,

        type: "error",

        title: "Registration Error",

        message:
          err.message || "Something went wrong while sending verification OTP.",

        onConfirm: () => setModal((prev) => ({ ...prev, show: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/signup", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(formData), // Ikkada dob mariyu gender kuda velthayi
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setModal({
        show: true,

        type: "success",

        title: "Account Created!",

        message:
          "Your Malar Crackers VIP account has been verified and registered successfully.",

        onConfirm: () => {
          setModal((prev) => ({ ...prev, show: false }));

          router.push("/login");
        },
      });
    } catch (err: any) {
      setModal({
        show: true,

        type: "error",

        title: "Verification Failed",

        message: err.message || "The OTP you entered is invalid or expired.",

        onConfirm: () => setModal((prev) => ({ ...prev, show: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] relative pb-10">
      <Navbar />

      <div className="container mx-auto px-6 pt-16 flex justify-center">
        <div className="bg-white p-8 rounded-2xl border border-yellow-500/30 shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-red-100 p-4 rounded-full text-red-700 mb-3">
              {step === 1 ? (
                <UserPlus className="h-8 w-8" />
              ) : (
                <MailCheck className="h-8 w-8 text-green-600" />
              )}
            </div>

            <h1 className="text-3xl font-black text-stone-800">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h1>

            <p className="text-stone-500 text-sm mt-1 text-center">
              {step === 1
                ? "Join Malar Crackers for premium discounts"
                : `Enter the 6-digit OTP sent to ${formData.email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none font-medium text-stone-800"
                  placeholder="Name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none font-medium text-stone-800"
                  placeholder="user@example.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none font-medium text-stone-800"
                  placeholder="xxxxxxxxxx"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              {/* DOB & Gender Fields Add Chesamu */}

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-stone-400" /> DOB
                  </label>

                  <input
                    type="date"
                    required
                    value={formData.dob}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none font-medium text-stone-800 uppercase"
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-1">
                    <Users className="h-4 w-4 text-stone-400" /> Gender
                  </label>

                  <select
                    required
                    value={formData.gender}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none font-medium text-stone-800 appearance-none bg-white"
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select
                    </option>

                    <option value="Male">Male</option>

                    <option value="Female">Female</option>

                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={formData.password}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 focus:outline-none font-medium text-stone-800"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white font-bold py-3.5 rounded-xl shadow-md hover:scale-105 transition flex justify-center items-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Get OTP on Email"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinalSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Enter 6-Digit OTP
                </label>

                <input
                  type="text"
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
                  value={formData.otp}
                  className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] rounded-xl border border-stone-200 focus:border-green-600 focus:outline-none font-black text-stone-800"
                  placeholder="------"
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      otp: e.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:scale-105 transition flex justify-center items-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Verify & Register"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-stone-500 font-bold hover:underline text-sm"
              >
                Back to Edit Details
              </button>
            </form>
          )}
        </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-stone-200 transform transition-all animate-in fade-in zoom-in duration-300">
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
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition duration-200 ${modal.type === "success" ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gradient-to-r from-red-600 to-red-700"}`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
