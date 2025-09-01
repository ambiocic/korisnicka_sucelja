"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaFilm, FaTv, FaUserAlt, FaInfoCircle, FaBars, FaTimes } from "react-icons/fa";
import { Logo } from "./Logo";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    // Auth state change listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Dynamic pages based on user state
  const pages = [
    { title: "FilmNest", path: "/", icon: null },
    { title: "Movies", path: "/Movies", icon: <FaFilm /> },
    { title: "TV Shows", path: "/TVShows", icon: <FaTv /> },
    user
      ? { title: "Your Account", path: "/Account/dashboard", icon: <FaUserAlt /> }
      : { title: "Log In / Register", path: "/Account", icon: <FaUserAlt /> },
    { title: "About Us", path: "/AboutUs", icon: <FaInfoCircle /> },
  ];

  // Process each navigation item
  const processPage = (
    page: { title: string; path: string; icon: JSX.Element | null },
    index: number,
    closeMenu: () => void
  ) => {
    const isActive = pathname === page.path || (page.path === "/Account/dashboard" && pathname.startsWith("/Account"));
    return (
      <li
        key={index}
        className={`flex items-center rounded-lg px-4 py-2 transition-all duration-300 ${
          isActive ? "bg-yellow-400/20 text-yellow-400 border-b-2 border-yellow-400" : "hover:bg-yellow-400/20 hover:text-yellow-400"
        }`}
      >
        <Link
          href={page.path}
          onClick={closeMenu}
          className="flex items-center font-semibold text-lg hover:scale-105 transition-transform duration-300"
        >
          {page.icon && <span className="text-xl mr-2">{page.icon}</span>}
          <span>{page.title}</span>
        </Link>
      </li>
    );
  };

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/40 p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        {/* Logo */}
        <Logo />

        {/* Center Menu (Desktop) */}
        <div className="hidden md:flex space-x-6">
          {pages.slice(1, 4).map((page, index) => processPage(page, index, () => {}))}
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {pages.slice(4).map((page, index) => processPage(page, index, () => {}))}
          {user && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                router.push("/Account");
              }}
              className="bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            className="text-yellow-400 text-2xl hover:scale-110 transition-transform duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden absolute top-20 left-0 right-0 bg-gray-800/95 backdrop-blur-sm p-4 space-y-4 transform transition-all duration-300 ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {pages.slice(1).map((page, index) => processPage(page, index, () => setIsMenuOpen(false)))}
        {user && (
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Logout failed:", error.message);
              } else {
                router.push("/Account");
                setIsMenuOpen(false);
              }
            }}
            className="w-full bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}