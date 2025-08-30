"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from "./components/Logo";
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
    const { data, error } = await supabase.from("movies").select("id, title, image, genre, release_year");
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
    const { data, error } = await supabase.from("tv_shows").select("id, title, image, genre, release_year");
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
                className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105 max-w-xs mx-auto"
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

        {/* Trending TV Shows */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tvShows.map((tvShow) => (
              <div
                key={tvShow.id}
                className="bg-background rounded-xl overflow-hidden shadow-lg flex flex-col transition-transform hover:scale-105 max-w-xs mx-auto border border-gray-300 dark:border-gray-700"
              >
                <Link href={`/TVShows/${tvShow.id}`}>
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={tvShow.image}
                      alt={tvShow.title}
                      width={300}
                      height={400}
                      style={{ objectFit: "cover" }}
                      className="w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-bold mb-2">{tvShow.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tvShow.genre}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Release Year: {tvShow.release_year}</p>
                  </div>
                </Link>
                <div className="p-4">
                  <button
                    onClick={() => addToWatchlist(tvShow, "tv_show")}
                    className="mt-3 bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-around items-center gap-8">
          <div className="flex items-center h-full">
            <Logo />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">Sitemap</h3>
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
                <a href="/Blog" className="hover:text-yellow-400">
                  Blog
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
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p className="flex items-center justify-center md:justify-start mb-2">
              <FaMapMarkerAlt className="mr-2" /> Ruđera Boškovića 32, 21000 Split, Hrvatska
            </p>
            <p className="flex items-center justify-center md:justify-start mb-2">
              <FaPhone className="mr-2" /> +385 000 000
            </p>
            <p className="flex items-center justify-center md:justify-start mb-2">
              <FaEnvelope className="mr-2" /> filmnest@fesb.hr
            </p>
            <div className="flex space-x-4 justify-center md:justify-start mt-4">
              <a href="#" className="text-white hover:text-yellow-400">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400">
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
  );
}