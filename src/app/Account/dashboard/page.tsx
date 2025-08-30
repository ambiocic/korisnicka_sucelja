"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Navigation } from "@/app/components/Navigation";
import { Logo } from "@/app/components/Logo";

export default function Dashboard() {
  type Media = {
    id: number;
    title: string;
    image: string;
    genre: string;
    release_year: number;
  };

  type WatchlistItem = {
    id: number;
    movie_id: number | null;
    tv_show_id: number | null;
    movie: Media | null;
    tv_show: Media | null;
  };

  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"title" | "release_year">("title");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/Account");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  // Fetch watchlist
  const fetchWatchlist = async () => {
    if (!user) return;
    setLoading(true);
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
      .order("id", { ascending: false }) as { data: WatchlistItem[] | null; error: any };

    if (error) {
      console.error("Error fetching watchlist:", error);
      alert("Failed to fetch watchlist. Please try again.");
    } else if (data) {
      // Sort watchlist based on sortBy criteria
      const sortedData = data.sort((a: WatchlistItem, b: WatchlistItem) => {
        const mediaA = a.movie ?? a.tv_show;
        const mediaB = b.movie ?? b.tv_show;
        if (!mediaA || !mediaB) return 0;
        if (sortBy === "title") {
          return mediaA.title.localeCompare(mediaB.title);
        }
        return mediaB.release_year - mediaA.release_year;
      });
      setWatchlist(sortedData);
    }
    setLoading(false);
  };

  // Remove from watchlist
  const removeFromWatchlist = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from("watchlist").delete().eq("id", id);
    if (error) {
      console.error("Error removing from watchlist:", error);
      alert("Failed to remove item from watchlist.");
    } else {
      alert("Item removed from watchlist!");
      fetchWatchlist();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchWatchlist();
  }, [user, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "title" | "release_year");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/Account");
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      <div className="mt-32 mx-4 md:mx-8 lg:mx-16">
        {/* User Profile Section */}
        <section className="mb-12 px-4">
          <div className="bg-background rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Dobrodošao, {user?.email?.split("@")[0] || "Korisnik"}
            </h1>
            {user && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500 dark:text-gray-300">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-300">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300">
                    <strong>Račun kreiran:</strong>{" "}
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString("hr-HR")
                      : "Nepoznato"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Odjavi se
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Watchlist Section */}
        <section className="mb-12 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Watchlist</h2>
            <div>
              <label htmlFor="sort" className="mr-2 text-gray-500 dark:text-gray-300">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="bg-background border border-gray-300 dark:border-gray-700 rounded-lg p-2"
              >
                <option value="title">Title</option>
                <option value="release_year">Release Year</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 p-4 animate-pulse"
                >
                  <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-1/2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : !user ? (
            <div className="bg-background rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 text-center">
              <p className="text-gray-500 dark:text-gray-300 font-bold text-lg">
                Loading...
              </p>
            </div>
          ) : watchlist.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">
              Your watchlist is empty. Add some movies or TV shows from the home page!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {watchlist.map((item) => {
                const media = item.movie ?? item.tv_show;
                if (!media) return null;
                return (
                  <div
                    key={item.id}
                    className="bg-background rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col transition-transform hover:scale-105 max-w-xs mx-auto"
                  >
                    <div className="relative w-full aspect-[3/4]">
                      <Image
                        src={media.image}
                        alt={media.title}
                        width={300}
                        height={400}
                        style={{ objectFit: "cover" }}
                        className="w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-2 truncate">{media.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{media.genre}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Release Year: {media.release_year}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="mt-3 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
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