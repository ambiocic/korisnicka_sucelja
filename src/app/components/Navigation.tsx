"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFilm, FaTv, FaRegNewspaper, FaUserAlt, FaInfoCircle, FaBars, FaTimes } from "react-icons/fa";
import { Logo } from "./Logo";

// Define all page links with titles, paths, and icons
const pages = [
  { title: "FilmNest", path: "/", icon: null },
  { title: "Movies", path: "/Movies", icon: <FaFilm /> },
  { title: "TV Shows", path: "/TVShows", icon: <FaTv /> },
  { title: "Blog", path: "/Blog", icon: <FaRegNewspaper /> },
  { title: "Account", path: "/Account", icon: <FaUserAlt /> },
  { title: "About Us", path: "/AboutUs", icon: <FaInfoCircle /> },
];

// Function to process each page and display icon + text
function processPage(page: { title: string; path: string; icon: JSX.Element | null }, index: number ) {
  return (
    <li key={index} className="flex items-center space-x-2 rounded-full px-3 py-2">
      <Link
        href={page.path}
        className={`flex items-center text-white font-semibold hover:text-yellow-400 hover:underline underline-offset-4 text-lg transition-all duration-300`}
      >
        {page.icon && <span className="text-xl mr-2">{page.icon}</span>}
        <span>{page.title}</span>
      </Link>
    </li>
  );
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 p-6 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Left side: FilmNest with no icon */}
        <Logo />

        {/* Center: Menu Links (Movies, TV Shows, Blog) */}
        <div className="hidden md:flex space-x-6">
          {pages.slice(1, 4).map((page, index) => processPage(page, index ))}
        </div>

        {/* Right side: Account and About Us */}
        <div className="hidden md:flex space-x-6">
          {pages.slice(4).map((page, index) => processPage(page, index))}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          {/* Hamburger Icon */}
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (toggle visibility based on isMenuOpen state) */}
      <div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-gray-800 p-4 space-y-4`}
      >
        {pages.slice(1, 4).map((page, index) => processPage(page, index))}
        {pages.slice(4).map((page, index) => processPage(page, index))}
      </div>
    </nav>
  );
}
