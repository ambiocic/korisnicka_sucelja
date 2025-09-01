"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Footer } from "@/app/components/footer";
import { Navigation } from "@/app/components/Navigation";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (activeTab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Invalid email or password." : error.message);
        return;
      }
      router.push("/Account/dashboard");
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(
          error.message.includes("User already registered")
            ? "This email is already registered."
            : error.message
        );
        return;
      }
      setSuccess("Check your email for confirmation!");
      setActiveTab("login");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="flex-grow flex items-center justify-center p-6 mt-20">
        <div className="m-28 bg-white/90 dark:bg-gray-900/40 dark:backdrop-blur-sm shadow-md rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 animate-fadeIn">
          {/* Tabs */}
          <div className="flex justify-between mb-6 gap-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-yellow-400/20 text-yellow-400 border-b-2 border-yellow-400"
                  : "bg-gray-200 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 hover:bg-yellow-400/20 hover:text-yellow-400"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-yellow-400/20 text-yellow-400 border-b-2 border-yellow-400"
                  : "bg-gray-200 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 hover:bg-yellow-400/20 hover:text-yellow-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <p className="text-red-500 font-semibold text-center bg-red-100/50 rounded-lg p-3">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 font-semibold text-center bg-green-100/50 rounded-lg p-3">
                {success}
              </p>
            )}

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:ring-2 hover:ring-yellow-400/50 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:ring-2 hover:ring-yellow-400/50 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {activeTab === "register" && (
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full p-3 pl-10 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:ring-2 hover:ring-yellow-400/50 transition-all duration-300"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 px-4 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-500 hover:scale-105 transition-all duration-300"
            >
              {activeTab === "login" ? "Log In" : "Register"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}