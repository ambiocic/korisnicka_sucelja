"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaFilm,
  FaTv,
  FaRegNewspaper,
  FaUserAlt,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Logo } from "./Logo";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dohvati trenutno logiranog korisnika
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    // Listener za login/logout promjene
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Dinamičke stranice, zavisno da li je korisnik logiran
  const pages = [
    { title: "FilmNest", path: "/", icon: null },
    { title: "Movies", path: "/Movies", icon: <FaFilm /> },
    { title: "TV Shows", path: "/TVShows", icon: <FaTv /> },
    { title: "Blog", path: "/Blog", icon: <FaRegNewspaper /> },
    user
      ? { title: "Your Account", path: "/Account/dashboard", icon: <FaUserAlt /> }
      : { title: "Log In / Register", path: "/Account", icon: <FaUserAlt /> },
    { title: "About Us", path: "/AboutUs", icon: <FaInfoCircle /> },
  ];

  function processPage(
    page: { title: string; path: string; icon: JSX.Element | null },
    index: number,
    closeMenu: () => void
  ) {
    return (
      <li
        key={index}
        className="flex items-center space-x-2 rounded-full px-3 py-2"
      >
        <Link
          href={page.path}
          onClick={closeMenu}
          className="flex items-center text-white font-semibold hover:text-yellow-400 hover:underline underline-offset-4 text-lg transition-all duration-300"
        >
          {page.icon && <span className="text-xl mr-2">{page.icon}</span>}
          <span>{page.title}</span>
        </Link>
      </li>
    );
  }

  // Klik van menija zatvara mobilni meni
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 p-6 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Center meni */}
        <div className="hidden md:flex space-x-6">
          {pages.slice(1, 4).map((page, index) =>
            processPage(page, index, () => {})
          )}
        </div>

        {/* Desna strana */}
        <div className="hidden md:flex items-center space-x-6">
          {pages.slice(4).map((page, index) =>
            processPage(page, index, () => {})
          )}
          {user && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-all"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobilni meni */}
      <div
        ref={menuRef}
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-gray-800 p-4 space-y-4`}
      >
        {pages.slice(1).map((page, index) =>
          processPage(page, index, () => setIsMenuOpen(false))
        )}
        {user && (
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
              setIsMenuOpen(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full text-center"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
