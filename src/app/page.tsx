"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";


import { Logo } from "./components/Logo";
import { Footer } from "./components/footer";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Home() {
  type Media = {
    id: number;
    title: string;
    image: string;
    genre: string;
    release_year: number;
  };

  const [movies, setMovies] = useState<Media[]>([]);
  const [tvShows, setTvShows] = useState<Media[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sitemapOpen, setSitemapOpen] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.log("Error fetching user:", error);
          setUser(null);
        } else if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch movies
  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, image, genre, release_year");
    if (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to fetch movies: " + (error.message || "Unknown error"));
    } else if (data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setMovies(shuffled.slice(0, 3));
    }
  };

  // Fetch TV shows
  const fetchTvShows = async () => {
    const { data, error } = await supabase
      .from("tv_shows")
      .select("id, title, image, genre, release_year");
    if (error) {
      console.error("Error fetching TV shows:", error);
      alert("Failed to fetch TV shows: " + (error.message || "Unknown error"));
    } else if (data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setTvShows(shuffled.slice(0, 3));
    }
  };

  // Add to watchlist with duplicate check
  const addToWatchlist = async (item: Media, type: "movie" | "tv_show") => {
    if (!user) {
      alert("Please sign in to add to your watchlist.");
      return;
    }

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

  useEffect(() => {
    fetchMovies();
    fetchTvShows();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 mb-4 mx-4 mt-24">
          <div className="absolute border rounded-lg inset-0 bg-background shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-foreground text-3xl md:text-5xl font-extrabold mb-4">
              Welcome to{" "}
              <span className="text-yellow-400 text-3xl md:text-5xl font-extrabold mb-4">
                Film
              </span>
              Nest
            </h1>
            <p className="text-gray-500 dark:text-gray-300 font-bold text-lg">
              Discover your next favorite movie or TV show!
            </p>
          </div>
        </div>

        {/* Recommended Movies */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105 h-full"
              >
                {/* Link samo za sliku i informacije */}
                <Link href={`/Movies/${movie.id}`} className="flex flex-col flex-1">
                  <div className="relative w-full h-64 flex justify-center items-center">
                    <Image
                      src={movie.image}
                      alt={movie.title}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {movie.genre}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Release Year: {movie.release_year}
                    </p>
                  </div>
                </Link>

                {/* Dugme izvan Linka da hover ne utječe na tekst */}
                <div className="p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToWatchlist(movie, "movie");
                    }}
                    className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Trending TV Shows */}
        {/* Trending TV Shows */}
<section className="mb-8 px-4">
  <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {tvShows.map((tvShow) => (
      <div
        key={tvShow.id}
        className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105 h-full"
      >
        {/* Link samo za sliku i informacije */}
        <Link href={`/TVShows/${tvShow.id}`} className="flex flex-col flex-1">
          <div className="relative w-full h-64 flex justify-center items-center">
            <Image
              src={tvShow.image}
              alt={tvShow.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-lg font-bold mb-2">{tvShow.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {tvShow.genre}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Release Year: {tvShow.release_year}
            </p>
          </div>
        </Link>

        {/* Dugme izvan Linka da hover ne utječe na tekst */}
        <div className="p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToWatchlist(tvShow, "tv_show");
            }}
            className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    ))}
  </div>
</section>

      </div>

      <Footer />
    </div>
  );
}
