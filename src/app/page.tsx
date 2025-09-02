"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/footer";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Home() {
  type Media = {
    id: number;
    title: string;
    image: string;
    genre: string;
    release_year: number;
    rating: number;
  };

  
  const [movies, setMovies] = useState<Media[]>([]);
  const [tvShows, setTvShows] = useState<Media[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, image, genre, release_year, rating");
    if (!error && data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setMovies(shuffled.slice(0, 3));
    }
  };

  const fetchTvShows = async () => {
    const { data, error } = await supabase
      .from("tv_shows")
      .select("id, title, image, genre, release_year, rating");
    if (!error && data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setTvShows(shuffled.slice(0, 3));
    }
  };

  const addToWatchlist = async (item: Media, type: "movie" | "tv_show") => {
    if (!user) {
      toast.error("Please sign in to add to your watchlist.");
      return;
    }
    const { data: existingItems, error: checkError } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq(type === "movie" ? "movie_id" : "tv_show_id", item.id);

    if (checkError || (existingItems && existingItems.length > 0)) {
      toast.error(`${item.title} is already in your watchlist!`);
      return;
    }

    const { error } = await supabase.from("watchlist").insert([
      {
        user_id: user.id,
        movie_id: type === "movie" ? item.id : null,
        tv_show_id: type === "tv_show" ? item.id : null,
      },
    ]);

    if (error) toast.error("Failed to add item to watchlist.");
    else toast.success(`${item.title} added to your watchlist!`);
  };

  useEffect(() => {
    fetchMovies();
    fetchTvShows();
  }, []);

  const MediaCard = ({ item, type }: { item: Media; type: "movie" | "tv_show" }) => (
  <Link
    href={type === "movie" ? `/Movies/${item.id}` : `/TVShows/${item.id}`}
    className="group relative overflow-hidden rounded-2xl shadow-xl flex flex-col md:flex-row cursor-pointer transition-transform hover:scale-105 hover:shadow-2xl no-underline"
  >
    {/* Slika */}
    <div className="w-full md:w-3/5 relative h-64 md:h-auto">
      <Image
        src={item.image}
        alt={item.title}
        width={800}
        height={1200}
        className="object-cover w-full h-full transition-transform group-hover:scale-105"
        unoptimized
      />
      <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-20 transition-opacity" />
    </div>

    {/* Info */}
    <div className="bg-background w-full md:w-2/5 p-6 flex flex-col justify-between relative z-10">
      <div className="flex-1">
        <h3 className="text-2xl md:text-3xl font-extrabold mb-2 md:mb-3 group-hover:text-yellow-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-700 mb-1 font-semibold">{item.genre}</p>
        <p className="text-gray-700 mb-1">Release Year: {item.release_year}</p>
        <p className="text-yellow-500 font-bold mb-4 md:mb-6 text-lg md:text-xl">
          Rating: {item.rating}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          addToWatchlist(item, type);
        }}
        className="bg-yellow-400 text-black py-3 px-6 md:px-8 rounded-xl hover:bg-yellow-500 font-bold text-center w-full md:w-auto transition"
      >
        Add to Watchlist
      </button>
    </div>
  </Link>
);




  return (
    <div className="bg-background text-gray-900 min-h-screen">
      <Navigation />
      <div className="mt-28 mx-4 md:mx-8">

        {/* Hero Section */}
        <div className="relative w-full flex flex-col items-start justify-center py-8 md:py-12 px-4 md:px-6 mb-10 animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-3 leading-tight md:leading-snug tracking-tight">
            <span className="text-yellow-500 drop-shadow-md">Film</span>
            <span className="text-black dark:text-white drop-shadow-sm ml-1">Nest</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg md:text-xl max-w-xl mt-2">
            Discover your next favorite movie or TV show!
          </p>
          {/* Subtle animated gray overlay */}
          <div className="absolute inset-0 bg-gray-800 opacity-10 rounded-xl animate-pulse-slow pointer-events-none z-0" />
        </div>

        {/* Recommended Movies */}
<section className="mb-16">
  <h2 className="dark:text-white text-3xl font-bold mb-8 px-2 md:px-4">Recommended Movies</h2>
  <div className="grid grid-cols-1 xl1200:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
    {movies.map((movie) => (
      <MediaCard key={movie.id} item={movie} type="movie" />
    ))}
  </div>
</section>

       {/* Trending TV Shows */}
<section className="mb-16">
  <h2 className="dark:text-white text-3xl font-bold mb-8 px-2 md:px-4">Trending TV Shows</h2>
  <div className="grid grid-cols-1 xl1200:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
    {tvShows.map((tvShow) => (
      <MediaCard key={tvShow.id} item={tvShow} type="tv_show" />
    ))}
  </div>
</section>
      </div>
      <Footer />
    </div>
  );
}
