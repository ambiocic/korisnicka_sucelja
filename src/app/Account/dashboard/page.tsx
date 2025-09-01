"use client";

import { useEffect, useState } from "react";
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

  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  // Removed unused loading state
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
       // Show a loading spinner while data is being fetched
      if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
          </div>
        );
      }
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
        movie:movies(id, title, image, genre, release_year, rating),
        tv_show:tv_shows(id, title, image, genre, release_year, rating)
      `)
      .eq("user_id", user.id)
      .order("id", { ascending: false }) as { data: WatchlistItem[] | null; error: Error | null };

    if (error) {
      console.error("Error fetching watchlist:", error);
      alert("Failed to fetch watchlist. Please try again.");
    } else if (data) {
      setWatchlist(data);
    }
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
    if (error) {
      console.error("Error fetching reviews:", error);
      alert("Failed to fetch reviews. Please try again.");
    } else if (data) {
      const formattedData = data.map((review) => ({
        ...review,
        media_type: review.movie_id ? "movie" : "tv_show",
      }));
      setReviews(formattedData);

    }
    console.log(data);
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
      fetchWatchlist();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchWatchlist();
  }, [user]);

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  // Separate movies and tv shows
  const watchlistMovies = watchlist.filter((item) => item.movie_id);
  const watchlistTVShows = watchlist.filter((item) => item.tv_show_id);

  // Delete account
  const deleteAccount = async () => {
    if (!user) return;

    // Optional: delete related user data
    await supabase.from("watchlist").delete().eq("user_id", user.id);
    await supabase.from("reviews").delete().eq("user_id", user.id);

    // Delete user
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } else {
      alert("Your account has been deleted.");
      router.push("/Account");
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      <div className="mt-32 mx-4">
        {/* Hero / Welcome Section */}
        <div className="relative bg-cover bg-center h-64 mb-4 mx-4 mt-24">
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg flex flex-col justify-center items-start p-6 md:px-16">
            <h1 className="text-foreground text-3xl md:text-5xl font-extrabold mb-4">
              Welcome, <span className="text-yellow-400">{user?.email?.split("@")[0] || "Korisnik"}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-lg">
              Here’s your personal dashboard. Check your watchlist or explore new movies and TV shows!
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col gap-4 px-4">
          {/* Account Card */}
          <div
            className="bg-white/10 dark:bg-gray-700/20 text-foreground rounded-lg p-4 shadow-md cursor-pointer flex justify-between items-center hover:bg-gray-400/20 transition-colors w-full"
            onClick={() => setShowAccountDetails(!showAccountDetails)}
          >
            <h2 className="text-lg font-semibold">Account</h2>
            <span className={`transform transition-transform duration-300 ${showAccountDetails ? "rotate-180" : ""}`}>
              ▼
            </span>
          </div>

          {showAccountDetails && user && (
            <div className="bg-white/5 dark:bg-gray-800/20 rounded-lg p-4 mt-2 border border-gray-300 dark:border-gray-700 space-y-4 w-full">
              <p><strong>Username:</strong> {user.email?.split("@")[0]}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Created:</strong> {user.created_at ? new Date(user.created_at).toLocaleString("hr-HR") : "Unknown"}</p>

              <button
                onClick={() => setShowChangePassword(true)}
                className="text-yellow-400 hover:underline text-sm"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Change Password Popup */}
          {showChangePassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 relative shadow-lg">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
                  onClick={() => setShowChangePassword(false)}
                >
                  ×
                </button>
                <h4 className="text-lg font-semibold mb-4">Change Password</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newPassword = formData.get("newPassword") as string;

                    if (!newPassword || newPassword.length < 6) {
                      alert("Password must be at least 6 characters long.");
                      return;
                    }

                    const { error } = await supabase.auth.updateUser({ password: newPassword });
                    if (error) {
                      console.error("Error changing password:", error);
                      alert("Failed to change password. Please try again.");
                    } else {
                      alert("Password changed successfully!");
                      e.currentTarget.reset();
                      setShowChangePassword(false);
                    }
                  }}
                  className="flex flex-col gap-2"
                >
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-background text-foreground"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 text-white py-1 px-2 rounded hover:bg-yellow-500 w-full"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Reviews Card */}
          <div
            className="bg-white/10 dark:bg-gray-700/20 text-foreground rounded-lg p-4 shadow-md cursor-pointer flex justify-between items-center hover:bg-gray-400/20 transition-colors w-full"
            onClick={() => setShowReviews(!showReviews)}
          >
            <h2 className="text-lg font-semibold">My Reviews</h2>
            <span>▼</span>
          </div>
          {showReviews && (
            <div className="bg-white/5 dark:bg-gray-800/20 rounded-lg p-4 mt-2 border border-gray-300 dark:border-gray-700 space-y-4 w-full max-h-96 overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">You have not written any reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-300 dark:border-gray-700 pb-2 mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <Link href={ review.media_type === "movie" ? `/Movies/${review.movie_id}` : `/TVShows/${review.tv_show_id}`} className="hover:underline">
                      <strong>{review.media_type === "movie" ? review.movies?.title : review.tv_shows?.title} </strong> </Link>{review.media_type === "movie" ? "Movie" : "TV Show"}
                    </p>
                    <p className="text-sm text-yellow-400 mb-1"><strong>Rating:</strong> {review.rating} / 5</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Review:</strong> {review.review_text}</p>
                  </div>
                ))
              )}
            </div> 

          )}

          {/* Watchlist Card */}
          <div
            className="bg-white/10 dark:bg-gray-700/20 text-foreground rounded-lg p-4 shadow-md cursor-pointer flex justify-between items-center hover:bg-gray-400/20 transition-colors w-full"
            onClick={() => setShowWishlist(!showWishlist)}
          >
            <h2 className="text-lg font-semibold">Watchlist</h2>
            <span className={`transform transition-transform duration-300 ${showWishlist ? "rotate-180" : ""}`}>
              ▼
            </span>
          </div>

          {showWishlist && (
            <div className="mt-2 w-full">
              {/* Movies */}
              {watchlistMovies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-md font-bold mb-2">Movies</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchlistMovies.map((item) => (
                      <div
                        key={item.id}
                        className="bg-background rounded-lg overflow-hidden shadow-lg dark:border-gray-700 flex flex-col transition-transform hover:scale-105 w-full"
                      >
                        <Link href={`/Movies/${item.movie_id}`} className="flex flex-col flex-1">
                        <div className="relative w-full aspect-[2/3]">
                          <Image
                            src={item.movie?.image || ""}
                            alt={item.movie?.title || ""}
                            fill
                            style={{ objectFit: "cover" }}
                            className="w-full h-full"
                            unoptimized
                          />
                        </div>
                        <div className="p-2 flex flex-col flex-1">
                          <h3 className="text-sm font-bold mb-1 truncate">{item.movie?.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">{item.movie?.genre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Year: {item.movie?.release_year}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rating: {item.movie?.rating}</p>
                        </div>
                        </Link>
                        <div className="p-2">
                          <button
                            onClick={() => removeFromWatchlist(item.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 w-full text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TV Shows */}
              {watchlistTVShows.length > 0 && (
                <div>
                  <h3 className="text-md font-bold mb-2">TV Shows</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchlistTVShows.map((item) => (
                      <div
                        key={item.id}
                        className="bg-background rounded-lg overflow-hidden shadow-lg dark:border-gray-700 flex flex-col transition-transform hover:scale-105 w-full"
                      >
                        <Link href={`/TVShows/${item.tv_show_id}`} className="flex flex-col flex-1">
                        <div className="relative w-full aspect-[2/3]">
                          <Image
                            src={item.tv_show?.image || ""}
                            alt={item.tv_show?.title || ""}
                            fill
                            style={{ objectFit: "cover" }}
                            className="w-full h-full"
                            unoptimized
                          />
                        </div>
                        <div className="p-2 flex flex-col flex-1">
                          <h3 className="text-sm font-bold mb-1 truncate">{item.tv_show?.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">{item.tv_show?.genre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Year: {item.tv_show?.release_year}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rating: {item.tv_show?.rating}</p>
                        </div>
                        </Link>
                        <div className="p-2">
                          <button
                            onClick={() => removeFromWatchlist(item.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 w-full text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delete Account Card */}
          <div
            className="bg-white/10 dark:bg-gray-700/20 text-red-500 rounded-lg p-4 shadow-md cursor-pointer flex justify-between items-center hover:bg-red-500/20 transition-colors w-full mb-4"
            onClick={() => setShowDeletePopup(true)}
          >
            <h2 className="text-lg font-semibold">Delete My Account</h2>
            <span className={`transform transition-transform ${showDeletePopup ? "rotate-180" : ""}`}>▼</span>
          </div>

          {/* Delete Confirmation Popup */}
          {showDeletePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-100 rounded-2xl p-6 w-80 relative shadow-xl border border-red-500">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-600 text-xl font-bold"
                  onClick={() => setShowDeletePopup(false)}
                >
                  ×
                </button>
                <h4 className="text-lg font-bold mb-4 text-red-500">Confirm Account Deletion</h4>
                <p className="text-sm mb-4 text-gray-700 dark:text-gray-800">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setShowDeletePopup(false)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-800 hover:text-white w-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

