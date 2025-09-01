"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Footer } from "@/app/components/footer";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

type Media = {
  id: number;
  title: string;
  image: string;
  genre: string;
  release_year: number;
  rating: number;
};

export default function TVShows() {
  const [tvShows, setTvShows] = useState<Media[]>([]);
  const [filteredShows, setFilteredShows] = useState<Media[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [genres, setGenres] = useState<string[]>([]);
  const [minYear, setMinYear] = useState(2000);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());

  const [sortBy, setSortBy] = useState("ratingDesc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    genres: [] as string[],
    releaseYear: [2000, new Date().getFullYear()],
    rating: [0, 10],
  });

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch TV shows
  useEffect(() => {
    const fetchTV = async () => {
      const { data } = await supabase
        .from("tv_shows")
        .select("id, title, image, genre, release_year, rating");

      if (data) {
        setTvShows(data as Media[]);
        setFilteredShows(data as Media[]);
        setGenres([...new Set(data.map((m) => m.genre))]);
        const years = data.map((m) => m.release_year);
        setMinYear(Math.min(...years));
        setMaxYear(Math.max(...years));
        setFilterOptions({
          genres: [],
          releaseYear: [Math.min(...years), Math.max(...years)],
          rating: [0, 10],
        });
      }
    };
    fetchTV();
  }, []);

  // Filtering & sorting
  useEffect(() => {
    let updated = [...tvShows];

    if (filterOptions.genres.length > 0) {
      updated = updated.filter((m) => filterOptions.genres.includes(m.genre));
    }

    updated = updated.filter(
      (m) =>
        m.release_year >= filterOptions.releaseYear[0] &&
        m.release_year <= filterOptions.releaseYear[1]
    );
    updated = updated.filter(
      (m) =>
        m.rating >= filterOptions.rating[0] && m.rating <= filterOptions.rating[1]
    );

    if (sortBy === "ratingDesc") updated.sort((a, b) => b.rating - a.rating);
    if (sortBy === "ratingAsc") updated.sort((a, b) => a.rating - b.rating);
    if (sortBy === "nameAsc") updated.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "nameDesc") updated.sort((a, b) => b.title.localeCompare(a.title));

    setFilteredShows(updated);
  }, [tvShows, sortBy, filterOptions]);

  const toggleGenre = (genre: string) => {
    if (filterOptions.genres.includes(genre)) {
      setFilterOptions({
        ...filterOptions,
        genres: filterOptions.genres.filter((g) => g !== genre),
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        genres: [...filterOptions.genres, genre],
      });
    }
  };

  const clearFilters = () => {
    setFilterOptions({
      genres: [],
      releaseYear: [minYear, maxYear],
      rating: [0, 10],
    });
    setSortBy("ratingDesc");
  };

  const hasActiveFilters =
    filterOptions.genres.length > 0 ||
    filterOptions.releaseYear[0] > minYear ||
    filterOptions.releaseYear[1] < maxYear ||
    filterOptions.rating[0] > 0 ||
    filterOptions.rating[1] < 10;

  const addToWatchlist = async (item: Media) => {
    if (!user) {
      alert("Please sign in to add to your watchlist.");
      return;
    }
    const { data: existing } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("tv_show_id", item.id)
      .single();

    if (existing) {
      alert(`${item.title} is already in your watchlist!`);
      return;
    }

    const { error } = await supabase.from("watchlist").insert([
      { user_id: user.id, movie_id: null, tv_show_id: item.id },
    ]);

    if (error) alert("Failed to add item to watchlist.");
    else alert(`${item.title} added to your watchlist!`);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      <div className="mt-32 mx-4">
   
        {/* Sort + Filter Button */}
        <div className="flex flex-wrap items-center mb-8 gap-2">
          {[
            { label: "Rating ↓", value: "ratingDesc" },
            { label: "Rating ↑", value: "ratingAsc" },
            { label: "A-Z", value: "nameAsc" },
            { label: "Z-A", value: "nameDesc" },
          ].map((option) => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                sortBy === option.value
                  ? "bg-yellow-400 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-300"
              }`}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="ml-auto px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white shadow transition"
          >
            Filters
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {filterOptions.genres.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className="bg-yellow-400 text-white px-3 py-1 rounded-full shadow hover:bg-yellow-500 text-sm"
              >
                {g} ✕
              </button>
            ))}
            {(filterOptions.releaseYear[0] > minYear ||
              filterOptions.releaseYear[1] < maxYear) && (
              <button
                onClick={() =>
                  setFilterOptions({
                    ...filterOptions,
                    releaseYear: [minYear, maxYear],
                  })
                }
                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full shadow text-sm"
              >
                Year: {filterOptions.releaseYear[0]} - {filterOptions.releaseYear[1]} ✕
              </button>
            )}
            {(filterOptions.rating[0] > 0 || filterOptions.rating[1] < 10) && (
              <button
                onClick={() =>
                  setFilterOptions({ ...filterOptions, rating: [0, 10] })
                }
                className="bg-green-200 text-green-800 px-3 py-1 rounded-full shadow text-sm"
              >
                Rating: {filterOptions.rating[0].toFixed(1)} -{" "}
                {filterOptions.rating[1].toFixed(1)} ✕
              </button>
            )}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"
              >
                Clear All ✕
              </button>
            )}
          </div>
        )}

        {/* Filter Side Panel */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md dark:bg-gray-800/80 h-full p-6 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setIsFilterOpen(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-bold mb-4">Filters</h3>

              {/* Genres */}
              <div className="mb-4">
                <label className="font-semibold mb-2 block">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g}
                      className={`px-4 py-1 rounded-full whitespace-nowrap ${
                        filterOptions.genres.includes(g)
                          ? "bg-yellow-400 text-white shadow"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-300"
                      }`}
                      onClick={() => toggleGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Release Year */}
              <div className="mb-6">
                <label className="font-semibold mb-2 block">Release Year:</label>
                <Slider
                  range
                  min={minYear}
                  max={maxYear}
                  value={filterOptions.releaseYear}
                  onChange={(value) =>
                    setFilterOptions({
                      ...filterOptions,
                      releaseYear: value as [number, number],
                    })
                  }
                  styles={{
                    track: { backgroundColor: "#facc15" },
                    handle: { borderColor: "#facc15", backgroundColor: "#facc15" },
                    rail: { backgroundColor: "#e5e7eb" },
                  }}
                  className="px-2"
                  marks={{
                    [filterOptions.releaseYear[0]]: `${filterOptions.releaseYear[0]}`,
                    [filterOptions.releaseYear[1]]: `${filterOptions.releaseYear[1]}`,
                  }}
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="font-semibold mb-2 block">Rating:</label>
                <Slider
                  range
                  min={0}
                  max={10}
                  step={0.1}
                  value={filterOptions.rating}
                  onChange={(value) =>
                    setFilterOptions({
                      ...filterOptions,
                      rating: value as [number, number],
                    })
                  }
                  styles={{
                    track: { backgroundColor: "#facc15" },
                    handle: { borderColor: "#facc15", backgroundColor: "#facc15" },
                    rail: { backgroundColor: "#e5e7eb" },
                  }}
                  className="px-2"
                  marks={{
                    [filterOptions.rating[0]]: `${filterOptions.rating[0].toFixed(1)}`,
                    [filterOptions.rating[1]]: `${filterOptions.rating[1].toFixed(1)}`,
                  }}
                />
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* TV Shows Grid */}
        <section className="mb-10 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredShows.map((tvShow) => (
              <div
                key={tvShow.id}
                className="bg-background rounded-lg overflow-hidden shadow-lg flex flex-col hover:scale-105 transition-transform"
              >
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Year: {tvShow.release_year}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rating: {tvShow.rating.toFixed(1)}
                    </p>
                  </div>
                </Link>
                <div className="p-2">
                  <button
                    onClick={() => addToWatchlist(tvShow)}
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
