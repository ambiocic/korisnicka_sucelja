"use client";

import { useState } from "react";
import { Navigation } from "../components/Navigation";

const movies = [
  { title: "Inception", image: "inception.jpg", genre: "Sci-Fi", rating: 8.8, releaseYear: 2010 },
  { title: "The Dark Knight", image: "dark-knight.jpg", genre: "Action", rating: 9.0, releaseYear: 2008 },
  { title: "Interstellar", image: "interstellar.jpg", genre: "Sci-Fi", rating: 8.6, releaseYear: 2014 },
];

export default function Movies() {
  const [filters, setFilters] = useState({
    genre: "All",
    rating: "All",
    userRating: "All",
    releaseYear: "All",
  });

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64   mb-4 mx-4 mt-24">
          <div className="absolute border rounded-lg inset-0 bg-white shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-black text-3xl md:text-5xl font-extrabold mb-4">
              Explore <span className="text-yellow-400">Movies</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Filter and find your next favorite movie!
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filter by Genre */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Genre</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              >
                <option value="All">All</option>
                <option value="Action">Action</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Romance">Romance</option>
              </select>
            </div>

            {/* Filter by Rating */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Rating</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              >
                <option value="All">All</option>
                <option value="9+">9+</option>
                <option value="8+">8+</option>
                <option value="7+">7+</option>
              </select>
            </div>

            {/* Filter by User Rating */}
            <div>
              <h3 className="text-lg font-semibold mb-2">User Rating</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setFilters({ ...filters, userRating: e.target.value })}
              >
                <option value="All">All</option>
                <option value="5 stars">5 Stars</option>
                <option value="4 stars">4 Stars</option>
                <option value="3 stars">3 Stars</option>
              </select>
            </div>

            {/* Filter by Release Year */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Release Year</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setFilters({ ...filters, releaseYear: e.target.value })}
              >
                <option value="All">All</option>
                <option value="2020s">2020s</option>
                <option value="2010s">2010s</option>
                <option value="2000s">2000s</option>
                <option value="1990s">1990s</option>
              </select>
            </div>
          </div>
        </section>

        {/* Movies Section */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((movie, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.genre}</p>
                  <p className="text-sm text-gray-400">Rating: {movie.rating}</p>
                  <p className="text-sm text-gray-400">
                    Release Year: {movie.releaseYear}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <footer className="text-center text-sm text-gray-400 pb-6">
          <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
