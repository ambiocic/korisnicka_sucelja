"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaLock } from "react-icons/fa";
import { Logo } from "@/app/components/Logo";
import { Navigation } from "@/app/components/Navigation";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
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
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
      alert("Check your email for registration confirmation!");
      setActiveTab("login");
      router.push("/Account/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navigation />
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6 mt-24 dark">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-600 animate-fadeIn">
          {/* Tabs */}
          <div className="flex justify-between mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 text-lg font-bold rounded-t-lg transition-colors ${
                activeTab === "login"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-200 dark:bg-gray-500 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 text-lg font-bold rounded-t-lg transition-colors ${
                activeTab === "register"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-200 dark:bg-gray-500 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 dark:text-red-400 font-semibold mb-4 text-center animate-pulse">
                {error}
              </p>
            )}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-11 text-gray-400 dark:text-gray-300" />
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 text-foreground p-3 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-11 text-gray-400 dark:text-gray-300" />
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 text-foreground p-3 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {activeTab === "register" && (
              <div className="relative mb-4">
                <FaLock className="absolute left-3 top-11 text-gray-400 dark:text-gray-300" />
                <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-600 text-foreground p-3 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-foreground py-8 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-around items-center gap-8">
          <div className="flex items-center h-full">
            <Logo />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-extrabold mb-4">Sitemap</h3>
            <ul>
              <li className="mb-2">
                <a href="/Movies" className="hover:text-yellow-400">
                  Movies
                </a>
              </li>
              <li className="mb-2">
                <a href="/TVShows" className="hover:text-yellow-400">
                  TV Shows
                </a>
              </li>
              <li className="mb-2">
                <a href="/Account" className="hover:text-yellow-400">
                  Account
                </a>
              </li>
              <li className="mb-2">
                <a href="/AboutUs" className="hover:text-yellow-400">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-extrabold mb-4">Contact Us</h3>
            <p className="flex items-center justify-center md:justify-start mb-2">
              <FaMapMarkerAlt className="mr-2" /> Ruđera Boškovića 32, 21000 Split, Croatia
            </p>
            <p className="flex items-center justify-center md:justify-start mb-2">
              <FaPhone className="mr-2" /> +385 000 000
            </p>
            <p className="flex items-center justify-center md:justify-start mb-2">
              <FaEnvelope className="mr-2" /> filmnest@fesb.hr
            </p>
            <div className="flex space-x-4 justify-center md:justify-start mt-4">
              <a href="#" className="text-foreground hover:text-yellow-400">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-foreground hover:text-yellow-400">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-foreground hover:text-yellow-400">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-foreground hover:text-yellow-400">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center text-sm mt-8">
          &copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}