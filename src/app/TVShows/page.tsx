"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export default function TVShows() {
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

  const [tvShows, setTvShows] = useState<Media[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // Fetch TV shows with filters
  useEffect(() => {
    fetchTvShows();
  }, [filters]);

  const fetchTvShows = async () => {
    let query = supabase
      .from("tv_shows")
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
      console.error("Error fetching TV shows:", error);
      alert("Failed to fetch TV shows: " + (error.message || "Unknown error"));
    } else {
      setTvShows(data ?? []);
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
          <div className="absolute  rounded-lg inset-0 bg-background shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-foreground text-3xl md:text-5xl font-extrabold mb-4">
              Explore <span className="text-yellow-400">TV Shows</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-lg">
              Filter and find your next favorite TV Show!
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

        {/* TV Shows Section */}
        {/* TV Shows Section */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tvShows.map((tvShow) => (
              <div
                key={tvShow.id}
                className="bg-background rounded-lg overflow-hidden shadow-lg dark:border-gray-700 flex flex-col transition-transform hover:scale-105"
              >
                {/* Link samo za sliku i informacije */}
                <Link href={`/TVShows/${tvShow.id}`} className="flex flex-col flex-1">
                  <div className="relative w-full aspect-[2/3]">
                    <Image
                      src={tvShow.image}
                      alt={tvShow.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="text-sm font-bold mb-1">{tvShow.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{tvShow.genre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Year: {tvShow.release_year}</p>
                  </div>
                </Link>

                {/* Dugme izvan Linka */}
                <div className="p-2">
                  <button
                    onClick={() => addToWatchlist(tvShow, "tv_show")}
                    className="bg-yellow-400 text-white py-1 px-2 rounded hover:bg-yellow-500 w-full text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Footer Section */}
         <Footer></Footer>
      </div>
    </div>
  );
}