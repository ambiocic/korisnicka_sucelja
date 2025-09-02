"use client";

import Link from "next/link";
import { FaFilm } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      {/* Film Icon */}
      <FaFilm className="text-yellow-400 text-8xl mb-6 opacity-80 animate-flicker" />

      {/* Header */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-400 mb-4 text-center">
        404 - Film Not Found!
      </h1>

      {/* Message with Emoji */}
      <p className="text-lg md:text-2xl text-gray-300 mb-8 text-center">
        This movie is off the program! 🎥 Find something new! 😊
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/"
          className="bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/Movies"
          className="bg-gray-700 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-600 transition-colors"
        >
          Explore Movies
        </Link>
        <Link
          href="/TVShows"
          className="bg-gray-700 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-600 transition-colors"
        >
          Explore TV Shows
        </Link>
      </div>
    </div>
  );
}
