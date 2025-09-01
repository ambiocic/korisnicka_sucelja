"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

type Media = {
  id: number;
  title: string;
  image: string;
  genre: string;
  release_year: number;
  rating?: number;
};

export default function Movies() {
  const [movies, setMovies] = useState<Media[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Media[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState("ratingDesc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    genre: "",
    releaseYear: "",
    rating: "",
  });

  useEffect(() => {
    // Fetch user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();

    // Fetch movies
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const { data } = await supabase
      .from("movies")
      .select("id, title, image, genre, release_year");
    if (data) setMovies(data as Media[]);
  };

  // Apply sort and filter
  useEffect(() => {
    let updated = [...movies];

    // Filter
    if (filterOptions.genre) updated = updated.filter(m => m.genre === filterOptions.genre);
    if (filterOptions.releaseYear) {
      const decade = parseInt(filterOptions.releaseYear.replace("s", ""));
      updated = updated.filter(m => m.release_year! >= decade && m.release_year! <= decade + 9);
    }
    if (filterOptions.rating) {
      updated = updated.filter(m => (m.rating || 0) >= parseInt(filterOptions.rating));
    }

    // Sort
    if (sortBy === "ratingDesc") updated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "ratingAsc") updated.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    if (sortBy === "nameAsc") updated.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "nameDesc") updated.sort((a, b) => b.title.localeCompare(a.title));

    setFilteredMovies(updated);
  }, [movies, sortBy, filterOptions]);

  const addToWatchlist = async (item: Media) => {
    if (!user) {
      alert("Please sign in to add to your watchlist.");
      return;
    }
    const { data: existing } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", item.id)
      .single();

    if (existing) {
      alert(`${item.title} is already in your watchlist!`);
      return;
    }

    const { error } = await supabase.from("watchlist").insert([{ user_id: user.id, movie_id: item.id }]);
    if (error) alert("Failed to add item to watchlist.");
    else alert(`${item.title} added to your watchlist!`);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      <div className="mt-32 mx-4">
        {/* Hero */}
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

        {/* Sort & Filter bar */}
        <div className="flex justify-between items-center mb-6 px-4">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold text-yellow-400">Sort By:</label>
            <select
              id="sort"
              className="border rounded p-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ratingDesc">Rating (High to Low)</option>
              <option value="ratingAsc">Rating (Low to High)</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
            </select>
          </div>

          {/* Filter button */}
          <button
            className="p-2 rounded text-white bg-yellow-400 hover:bg-yellow-500"
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
          </button>
        </div>

        {/* Active Filters */}
<div className="px-4 mb-8 flex flex-wrap gap-2">
  {filterOptions.genre && (
    <div className="flex items-center bg-white shadow px-3 py-1 rounded-full text-sm">
      <span>{filterOptions.genre}</span>
      <button
        onClick={() => setFilterOptions({ ...filterOptions, genre: "" })}
        className="ml-2 text-gray-500 hover:text-gray-800 font-bold"
      >
        ×
      </button>
    </div>
  )}
  {filterOptions.releaseYear && (
    <div className="flex items-center bg-white shadow px-3 py-1 rounded-full text-sm">
      <span>{filterOptions.releaseYear}</span>
      <button
        onClick={() => setFilterOptions({ ...filterOptions, releaseYear: "" })}
        className="ml-2 text-gray-500 hover:text-gray-800 font-bold"
      >
        ×
      </button>
    </div>
  )}
  {filterOptions.rating && (
    <div className="flex items-center bg-white shadow px-3 py-1 rounded-full text-sm">
      <span>{filterOptions.rating}+</span>
      <button
        onClick={() => setFilterOptions({ ...filterOptions, rating: "" })}
        className="ml-2 text-gray-500 hover:text-gray-800 font-bold"
      >
        ×
      </button>
    </div>
  )}

  {/* Clear All */}
  {(filterOptions.genre || filterOptions.releaseYear || filterOptions.rating) && (
    <button
      onClick={() => setFilterOptions({ genre: "", releaseYear: "", rating: "" })}
      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
    >
      Clear All
    </button>
  )}
</div>

        {/* Filter Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsFilterOpen(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-bold mb-4">Filter Options</h3>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-semibold mb-1">Genre:</label>
                  <select
                    className="w-full border rounded p-1"
                    value={filterOptions.genre}
                    onChange={(e) => setFilterOptions({...filterOptions, genre: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="Action">Action</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Release Year:</label>
                  <select
                    className="w-full border rounded p-1"
                    value={filterOptions.releaseYear}
                    onChange={(e) => setFilterOptions({...filterOptions, releaseYear: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="2020s">2020s</option>
                    <option value="2010s">2010s</option>
                    <option value="2000s">2000s</option>
                    <option value="1990s">1990s</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Rating:</label>
                  <select
                    className="w-full border rounded p-1"
                    value={filterOptions.rating}
                    onChange={(e) => setFilterOptions({...filterOptions, rating: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="9">9+</option>
                    <option value="8">8+</option>
                    <option value="7">7+</option>
                  </select>
                </div>
                <button
                  className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        <section className="mb-8 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="bg-background rounded-lg overflow-hidden shadow-lg flex flex-col hover:scale-105 transition-transform">
                <Link href={`/Movies/${movie.id}`} className="flex flex-col flex-1">
                  <div className="relative w-full aspect-[2/3]">
                    <Image src={movie.image} alt={movie.title} fill style={{ objectFit: "cover" }} className="w-full h-full" unoptimized />
                  </div>
                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="text-sm font-bold mb-1">{movie.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{movie.genre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Year: {movie.release_year}</p>
                  </div>
                </Link>
                <div className="p-2">
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="bg-yellow-400 text-white py-1 px-2 rounded hover:bg-yellow-500 w-full text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
