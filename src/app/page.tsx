"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from "./components/Logo";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

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
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

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

  // Fetch movies
  const fetchMovies = async () => {
    const { data, error } = await supabase.from("movies").select("*");
    if (error) {
      console.log("Error fetching movies:", error);
    } else if (data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setMovies(shuffled.slice(0, 3));
    }
  };

  // Fetch TV shows
  const fetchTvShows = async () => {
    const { data, error } = await supabase.from("tv_shows").select("*");
    if (error) {
      console.log("Error fetching TV shows:", error);
    } else if (data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setTvShows(shuffled.slice(0, 3));
    }
  };

  // Fetch watchlist (koristimo alias da ne bude konflikt)
  const fetchWatchlist = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("watchlist")
      .select(`
        id,
        movie_id,
        tv_show_id,
        movie:movies(id, title, image, genre, release_year),
        tv_show:tv_shows(id, title, image, genre, release_year)
      `)
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching watchlist:", error);
    } else {
      setWatchlist(data);
    }
  };

  // Add to watchlist
  const addToWatchlist = async (item: Media, type: "movie" | "tv_show") => {
    if (!user) {
      alert("Please sign in to add to your watchlist.");
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
    } else {
      fetchWatchlist();
    }
  };

  // Remove from watchlist
  const removeFromWatchlist = async (id: number) => {
    const { error } = await supabase.from("watchlist").delete().eq("id", id);
    if (error) {
      console.error("Error removing from watchlist:", error);
    } else {
      fetchWatchlist();
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTvShows();
  }, []);

  useEffect(() => {
    if (user) fetchWatchlist();
  }, [user]);

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
                className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105"
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    width={400}
                    height={533}
                    style={{ objectFit: "cover" }}
                    className="w-full h-full"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{movie.genre}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Release Year: {movie.release_year}</p>
                  <button
                    onClick={() => addToWatchlist(movie, "movie")}
                    className="mt-3 bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500"
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
                className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105"
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={tvShow.image}
                    alt={tvShow.title}
                    width={400}
                    height={533}
                    style={{ objectFit: "cover" }}
                    className="w-full h-full"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-2">{tvShow.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tvShow.genre}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Release Year: {tvShow.release_year}</p>
                  <button
                    onClick={() => addToWatchlist(tvShow, "tv_show")}
                    className="mt-3 bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Watchlist */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
          {!user ? (
            <div className="bg-background rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 text-center">
              <p className="text-gray-500 dark:text-gray-300 font-bold text-lg mb-4">
                Sign in to access your Watchlist
              </p>
              <a
                href="/Account"
                className="bg-yellow-400 text-white font-bold py-2 px-4 rounded inline-block"
              >
                Sign In / Register
              </a>
            </div>
          ) : watchlist.length === 0 ? (
            <p className="text-center text-gray-500">Your watchlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {watchlist.map((item) => {
                const media = item.movie ?? item.tv_show;
                if (!media) return null;
                return (
                  <div
                    key={item.id}
                    className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col"
                  >
                    <div className="relative w-full aspect-[3/4]">
                      <Image
                        src={media.image}
                        alt={media.title}
                        width={400}
                        height={533}
                        style={{ objectFit: "cover" }}
                        className="w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{media.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{media.genre}</p>
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="mt-3 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              <li className="mb-2">Movies</li>
              <li className="mb-2">TV Shows</li>
              <li className="mb-2">Blog</li>
              <li className="mb-2">Account</li>
              <li className="mb-2">About Us</li>
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
              <FaFacebook size={24} className="text-white hover:text-yellow-400" />
              <FaTwitter size={24} className="text-white hover:text-yellow-400" />
              <FaInstagram size={24} className="text-white hover:text-yellow-400" />
              <FaLinkedin size={24} className="text-white hover:text-yellow-400" />
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
