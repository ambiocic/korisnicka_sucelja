"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from "@/app/components/Logo";
import Link from "next/link";

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
  const [user, setUser] = useState<User | null>(null);

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // Fetch movies with filters
  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    let query = supabase
      .from("movies")
      .select("id, title, image, genre, release_year")
      .limit(10);

    // Apply genre filter
    if (filters.genre !== "All") {
      query = query.eq("genre", filters.genre);
    }

    // Apply release year filter
    if (filters.releaseYear !== "All") {
      const decadeStart = parseInt(filters.releaseYear.replace("s", ""));
      query = query
        .gte("release_year", decadeStart)
        .lte("release_year", decadeStart + 9);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to fetch movies: " + (error.message || "Unknown error"));
    } else {
      setMovies(data ?? []);
    }
  };

  // Add to watchlist with duplicate check
  const addToWatchlist = async (item: Media, type: "movie" | "tv_show") => {
    if (!user) {
      alert("Please sign in to add to your watchlist.");
      return;
    }

    // Check if the item is already in the watchlist
    const { data: existingItems, error: checkError } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq(type === "movie" ? "movie_id" : "tv_show_id", item.id);

    if (checkError) {
      console.error("Error checking watchlist:", checkError);
      alert("Failed to check watchlist. Please try again.");
      return;
    }

    if (existingItems && existingItems.length > 0) {
      alert(`${item.title} is already in your watchlist!`);
      return;
    }

    // If not a duplicate, insert the item
    const { error } = await supabase.from("watchlist").insert([
      {
        user_id: user.id,
        movie_id: type === "movie" ? item.id : null,
        tv_show_id: type === "tv_show" ? item.id : null,
      },
    ]);

    if (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add item to watchlist.");
    } else {
      alert(`${item.title} added to your watchlist!`);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 mb-4 mx-4 mt-24">
          <div className="absolute inset-0 bg-background shadow-lg flex flex-col justify-center items-start p-6">
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
                className="w-full p-2 border border-white dark:border-gray-700 rounded-md bg-background text-foreground"
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
                className="w-full p-2 border border-white dark:border-gray-700 rounded-md bg-background text-foreground"
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
                className="w-full p-2 border border-white dark:border-gray-700 rounded-md bg-background text-foreground"
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
                className="w-full p-2 border border-white dark:border-gray-700 rounded-md bg-background text-foreground"
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
          <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-background rounded-xl overflow-hidden shadow-lg  dark:border-gray-700 flex flex-col transition-transform hover:scale-105 max-w-xs mx-auto"
              >
                <Link href={`/Movies/${movie.id}`}>
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={movie.image}
                      alt={movie.title}
                      width={300}
                      height={400}
                      style={{ objectFit: "cover" }}
                      className="w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{movie.genre}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Release Year: {movie.release_year}</p>
                  </div>
                </Link>
                <div className="p-4">
                  <button
                    onClick={() => addToWatchlist(movie, "movie")}
                    className="mt-3 bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
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
    </div>
  );
}