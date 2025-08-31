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
  const [username, setUsername] = useState(""); // <-- novo polje
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
      router.push("/Account/dashboard");
    } else {
      if (password !== confirmPassword) {
        return setError("Passwords do not match!");
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username } // <-- pohrani username u metadata
        },
      });
      if (error) return setError(error.message);
      alert("Check your email for registration confirmation!");
      setActiveTab("login");
      router.push("/Account/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="flex-grow flex items-center justify-center p-6 mt-24">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200 animate-fadeIn">
          <div className="flex justify-between mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 text-lg font-bold rounded-t-lg transition-colors ${
                activeTab === "login"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 text-lg font-bold rounded-t-lg transition-colors ${
                activeTab === "register"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 font-semibold mb-4 text-center">{error}</p>}

            {activeTab === "register" && (
              <div className="relative mb-4">
                <label className="block text-sm mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="border bg-gray-50 text-foreground p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-11 text-gray-400" />
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border bg-gray-50 text-foreground p-3 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-11 text-gray-400" />
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border bg-gray-50 text-foreground p-3 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {activeTab === "register" && (
              <div className="relative mb-4">
                <FaLock className="absolute left-3 top-11 text-gray-400" />
                <label className="block text-sm mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="border bg-gray-50 text-foreground p-3 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-4 py-3 rounded-lg w-full font-bold hover:bg-yellow-500 transition-colors"
            >
              {activeTab === "login" ? "Log in" : "Register"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
