"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Navigation } from "@/app/components/Navigation";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export default function Dashboard() {
  type Media = {
    id: number;
    title: string;
    image: string;
    genre: string;
    release_year: number;
    rating: number;
  };

  type WatchlistItem = {
    id: number;
    movie_id: number | null;
    tv_show_id: number | null;
    movie: Media | null;
    tv_show: Media | null;
  };

  type ReviewItem = {
    id: number;
    user_id: string;
    movie_id: number | null;
    tv_show_id: number | null;
    rating: number;
    review_text: string;
    created_at: string;
    movies: Media | null;
    tv_shows: Media | null;
    media_type?: "movie" | "tv_show";
  };

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "account" | "watchlist" | "reviews"
  >("account");
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Refs for scrollable containers
  const watchlistRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Scroll handlers
  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Change Password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage(null);
    setLoading(true);

    // Validate inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Verify old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: oldPassword,
      });
      if (signInError) {
        setMessage("Incorrect old password.");
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setMessage("Password updated successfully!");
      setShowModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Error updating password: " + (error as Error).message);
    }
    setLoading(false);
  };

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

  const fetchWatchlist = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = (await supabase
      .from("watchlist")
      .select(
        `
        id,
        movie_id,
        tv_show_id,
        movie:movies(id, title, image, genre, release_year, rating),
        tv_show:tv_shows(id, title, image, genre, release_year, rating)
      `,
      )
      .eq("user_id", user.id)
      .order("id", { ascending: false })) as {
      data: WatchlistItem[] | null;
      error: Error | null;
    };

    if (error) console.error(error);
    else if (data) setWatchlist(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, movies(*), tv_shows(*)`)
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    if (error) console.error(error);
    else if (data) {
      const formattedData = data.map((review) => ({
        ...review,
        media_type: review.movie_id ? "movie" : "tv_show",
      }));
      setReviews(formattedData);
    }
    setLoading(false);
  };

  const removeFromWatchlist = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from("watchlist").delete().eq("id", id);
    if (error) console.error(error);
    else fetchWatchlist();
    setLoading(false);
  };

  const deleteAccount = async () => {
    if (!user) return;
    await supabase.from("watchlist").delete().eq("user_id", user.id);
    await supabase.from("reviews").delete().eq("user_id", user.id);
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (!error) router.push("/Account");
  };

  useEffect(() => {
    if (user) {
      fetchWatchlist();
      fetchReviews();
    }
  }, [user]);

  const watchlistMovies = watchlist.filter((item) => item.movie_id);
  const watchlistTVShows = watchlist.filter((item) => item.tv_show_id);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Navigation />

      <main className="px-6 md:px-12 mt-28 flex-1 w-full mx-auto space-y-8 pb-24">
        {/* Welcome / Stats */}
        <div className="rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome,{" "}
              <span className="text-yellow-400">
                {user?.email?.split("@")[0]}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-600 mt-1">
              Here’s your personal dashboard.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="font-bold text-xl">{watchlist.length}</p>
              <p className="text-sm text-gray-400">Watchlist</p>
            </div>

            <div className="text-center">
              <p className="font-bold text-xl">{reviews.length}</p>
              <p className="text-sm text-gray-400">Reviews</p>
            </div>
          </div>
        </div>

        {/* Message for Change Password */}
        {message && (
          <div
            className={`p-4 rounded-lg text-center w-full ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message}
          </div>
        )}

        {/* Change Password Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/90 dark:bg-gray-100/90 p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Old Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setOldPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setMessage(null);
                    }}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Horizontal Tabs */}
        <div className="flex gap-4  dark:border-gray-700 w-full">
          {["account", "watchlist", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as "account" | "watchlist" | "reviews")
              }
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-yellow-400 text-black shadow"
                  : "bg-white/10 dark:bg-gray-700/20 text-foreground hover:bg-gray-400/20"
              }`}
            >
              {tab === "account"
                ? "Account"
                : tab === "watchlist"
                  ? "Watchlist"
                  : "My Reviews"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 space-y-6 w-full">
          {/* Account */}
          {activeTab === "account" && user && (
            <div className="w-full">
              <div className="bg-white/90 dark:bg-gray-900/40 p-6 rounded-xl shadow-md space-y-3 w-full">
                <p>
                  <strong>Username:</strong> {user.email?.split("@")[0]}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Account Created:</strong>{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US")
                    : "Unknown"}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors mt-4 disabled:opacity-50"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={deleteAccount}
                    disabled={loading}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors mt-4 disabled:opacity-50"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Watchlist */}
          {activeTab === "watchlist" && (
            <div className="w-full relative">
              {watchlist.length === 0 ? (
                <div className="bg-white/90 dark:bg-gray-900/40 p-6 rounded-xl shadow-md text-gray-500 dark:text-gray-600 w-full text-center">
                  Your watchlist is empty.
                </div>
              ) : (
                <>
                  <>
                    <button
                      onClick={() => scrollLeft(watchlistRef)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-yellow-400/50 text-yellow-400 p-4 rounded-full shadow-md text-2xl z-10 hover:bg-yellow-400/70 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => scrollRight(watchlistRef)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400/50 text-yellow-400 p-4 rounded-full shadow-md text-2xl z-10 hover:bg-yellow-400/70 transition-colors"
                    >
                      →
                    </button>
                  </>

                  <div
                    ref={watchlistRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 w-full no-scrollbar"
                  >
                    {watchlistMovies.concat(watchlistTVShows).map((item) => {
                      const media = item.movie || item.tv_show;
                      const link = item.movie
                        ? `/Movies/${item.movie_id}`
                        : `/TVShows/${item.tv_show_id}`;
                      return (
                        <div
                          key={item.id}
                          className="flex-none w-40 sm:w-44 md:w-48 lg:w-52 bg-white/90 dark:bg-gray-900/40 rounded-xl shadow-md hover:shadow-2xl transition-transform hover:scale-105 relative overflow-visible group"
                        >
                          <Link href={link} className="flex flex-col">
                            <div className="relative w-full aspect-[2/3]">
                              <Image
                                src={media?.image || ""}
                                alt={media?.title || ""}
                                fill
                                style={{ objectFit: "cover" }}
                                className="w-full h-full rounded-t-xl"
                                unoptimized
                              />
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                              <h3 className="text-sm md:text-base font-semibold truncate">
                                {media?.title}
                              </h3>
                              <p className="text-[10px] md:text-sm text-gray-400 mb-1 truncate">
                                {media?.genre}
                              </p>
                              <p className="text-[10px] md:text-sm text-gray-400">
                                Year: {media?.release_year}
                              </p>
                              <p className="text-[10px] md:text-sm text-yellow-400">
                                Rating: {media?.rating}
                              </p>
                            </div>
                          </Link>
                          <button
                            onClick={() => removeFromWatchlist(item.id)}
                            className="absolute bottom-4 right-2 bg-red-500 text-white p-1 rounded-lg shadow-md text-sm  hover:bg-red-600 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="w-full relative">
              {reviews.length === 0 ? (
                <div className="bg-white/90 dark:bg-gray-900/40 p-6 rounded-xl shadow-md text-gray-500 dark:text-gray-600 w-full text-center">
                  You have not written any reviews yet.
                </div>
              ) : (
                <>
                  <>
                    <button
                      onClick={() => scrollLeft(reviewsRef)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-yellow-400/50 text-yellow-400 p-4 rounded-full shadow-md text-2xl z-10 hover:bg-yellow-400/70 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => scrollRight(reviewsRef)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400/50 text-yellow-400 p-4 rounded-full shadow-md text-2xl z-10 hover:bg-yellow-400/70 transition-colors"
                    >
                      →
                    </button>
                  </>

                  <div
                    ref={reviewsRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 w-full no-scrollbar"
                  >
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex-none w-40 sm:w-44 md:w-48 lg:w-52 bg-white/90 dark:bg-gray-100/90 rounded-xl shadow-md p-4 hover:shadow-2xl transition-transform hover:scale-105 flex flex-col overflow-visible group"
                      >
                        <Link
                          href={
                            review.movie_id
                              ? `/Movies/${review.movie_id}`
                              : `/TVShows/${review.tv_show_id}`
                          }
                          className="hover:underline font-bold mb-1 text-sm md:text-base truncate"
                        >
                          {review.movie_id
                            ? review.movies?.title
                            : review.tv_shows?.title}
                        </Link>
                        <p className="text-xs md:text-sm text-gray-400 mb-1">
                          Type: {review.movie_id ? "Movie" : "TV Show"}
                        </p>
                        <p className="text-xs md:text-sm text-yellow-400 mb-2">
                          <strong>Rating:</strong> {review.rating}/5
                        </p>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 line-clamp-4">
                          {review.review_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
