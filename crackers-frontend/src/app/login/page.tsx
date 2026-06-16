// src/app/login/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { LogIn, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Login Page Custom Alert Modal State Setup
  const [modal, setModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      // Save credentials in client browser memory local store variables
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);

      // Login success popup animation layout configuration
      setModal({
        show: true,
        type: "success",
        title: "Login Successful!",
        message: `Welcome back, ${data.user.name}! Redirecting you to our premium catalog collection store.`,
        onConfirm: () => {
          setModal((prev) => ({ ...prev, show: false }));
          router.push("/catalog");
        },
      });
    } catch (err: any) {
      // Invalid verification credentials warning trigger template
      setModal({
        show: true,
        type: "error",
        title: "Authentication Failed",
        message:
          err.message ||
          "Invalid email address or secure identity password details.",
        onConfirm: () => setModal((prev) => ({ ...prev, show: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] relative">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 flex justify-center">
        <div className="bg-white p-8 rounded-2xl border border-yellow-500/30 shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-amber-100 p-4 rounded-full text-amber-700 mb-3">
              <LogIn className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-stone-800">Welcome Back</h1>
            <p className="text-stone-500 text-sm mt-1">
              Sign in to access your custom VIP pricing
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white font-bold py-3.5 rounded-xl shadow-md hover:from-red-600 hover:to-red-700 transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-red-700 font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Login Status Modal Alert Overlay Screen */}
      {modal.show && (
        <div className="fixed inset-0 z- flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
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
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
