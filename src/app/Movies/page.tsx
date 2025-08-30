"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Movies() {
  const [filters, setFilters] = useState({
    genre: "All",
    rating: "All",
    userRating: "All",
    releaseYear: "All",
  });

type Media = {
    id: number;
    title: string;
    image: string;
    genre: string;
    release_year: number;
  };

  const [movies, setMovies] = useState<Media[]>([]);
  
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .limit(10);
    if (error) console.log('Error fetching movies:', error);
    else setMovies(data ?? []);
  };



  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 mb-4 mx-4 mt-24">
          <div className="absolute border rounded-lg inset-0 bg-background shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-foreground text-3xl md:text-5xl font-extrabold mb-4">
              Explore <span className="text-yellow-400">Movies</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-lg">
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
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background text-foreground"
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
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background text-foreground"
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
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background text-foreground"
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
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background text-foreground"
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
          <h2 className="text-2xl font-bold mb-4">TV Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((movie) => (
                <div
                key={movie.id}
                className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105"
                >
                <div className="relative w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-t-xl shadow-md">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    width={400}
                    height={533}
                    style={{ objectFit: "cover" }}
                    className="w-full h-full rounded-t-xl transition-transform duration-300 hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{movie.genre}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                  Release Year: {movie.release_year}
                  </p>
                </div>
                </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">
          <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
