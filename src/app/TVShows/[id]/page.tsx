"use client";

import { useState, useEffect, FormEvent } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/app/components/footer";
import { toast } from "react-toastify";

type Media = {
  id: number;
  title: string;
  image: string | null;
  genre: string | null;
  release_year: number | null;
  description: string | null;
  rating: number | null;
};

type Review = {
  id: number;
  user_id: string;
  tv_show_id: number | null;
  rating: number;
  review_text: string;
  created_at: string;
  email?: string | null;
};

type PostProps = {
  params: Promise<{ id: string }>;
};

function getDisplayName(email?: string) {
  return email?.split("@")[0] || "Unknown";
}

async function getTVShowById(id: string): Promise<Media | null> {
  const { data, error } = await supabase
    .from("tv_shows")
    .select("id, title, image, genre, release_year, description, rating")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Media;
}

async function getReviews(tvShowId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews_with_user")
    .select("*")
    .eq("tv_show_id", tvShowId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as Review[]) || [];
}

export default function TVShowPage({ params }: PostProps) {
  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newReview, setNewReview] = useState<{ rating: number; text: string }>({ rating: 0, text: "" });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editReviewId, setEditReviewId] = useState<number | null>(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        const tvShowData = await getTVShowById(id);
        if (!tvShowData) notFound();
        setMedia(tvShowData);
        const reviewsData = await getReviews(id);
        setReviews(reviewsData);
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) setUser(userData.user);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params]);

  const handleAddToWatchlist = async () => {
    if (!user || !media) return toast.error("Sign in to add to watchlist.");
    const { data: existing } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("tv_show_id", media.id)
      .single();
    if (existing) return toast.error("Already in watchlist.");
    const { error } = await supabase.from("watchlist").insert([{ user_id: user.id, movie_id: null, tv_show_id: media.id }]);
    if (error) return toast.error("Failed to add to watchlist.");
    toast.success("Added to watchlist!");
  };

  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !media || !newReview.rating || !newReview.text.trim()) return;
    let error;
    if (editReviewId) {
      ({ error } = await supabase
        .from("reviews")
        .update({ rating: newReview.rating, review_text: newReview.text })
        .eq("id", editReviewId));
      setEditReviewId(null);
    } else {
      ({ error } = await supabase.from("reviews").insert([
        {
          user_id: user.id,
          tv_show_id: media.id,
          movie_id: null,
          rating: newReview.rating,
          review_text: newReview.text,
        },
      ]));
    }
    if (error) return toast.error("Failed to submit review.");
    setNewReview({ rating: 0, text: "" });
    const reviewsData = await getReviews(media.id.toString());
    setReviews(reviewsData);
    toggleModal();
  };

  const handleEdit = (review: Review) => {
    setEditReviewId(review.id);
    setNewReview({ rating: review.rating, text: review.review_text });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error("Failed to delete review.");
    else
      toast.success("Review deleted.");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading)
    return (
      <main className="flex min-h-screen flex-col items-center p-10 mt-28">
        <div className="w-full max-w-2xl bg-gray-200 dark:bg-gray-700 p-6 rounded-lg border shadow-md animate-pulse"></div>
      </main>
    );

  if (!media) notFound();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-6 mt-28 w-full">
        {/* Back link */}
        <div className="w-full max-w-4xl mb-4">
          <Link href="/TVShows" className="inline-flex items-center text-yellow-400 font-semibold hover:text-yellow-500 transition-colors">
            ← Back to TV Shows
          </Link>
        </div>

      {/* TV Show Card */}
<div className=" border dark:border-gray-800 w-full max-w-4xl bg-white dark:bg-black p-6 rounded-lg  shadow-md flex flex-col md:flex-row gap-6">
  {media.image && (
    <div className="flex flex-col items-center w-full md:w-1/3">
      <div className="relative w-full aspect-[2/3] mb-4 rounded-lg overflow-hidden">
        <Image src={media.image} alt={media.title} fill style={{ objectFit: "cover" }} />
      </div>
      <button onClick={handleAddToWatchlist} className="bg-yellow-400 font-extrabold  text-white py-2 px-4 rounded-lg hover:bg-yellow-500 w-full mt-2">
        Add to Watchlist
      </button>
    </div>
  )}

  <div className="flex-1 flex flex-col justify-start">
    <h1 className="text-3xl font-extrabold mb-2">{media.title}</h1>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Genre: {media.genre || "N/A"}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Release Year: {media.release_year || "N/A"}</p>
    {media.rating !== null && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Rating: {media.rating} ★</p>}
    <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">{media.description || "No description available."}</p>

    {/* Prosječna ocjena i raspodjela zvjezdica */}
    {reviews.length > 0 && (
      <div className="mt-12 ml-10 p-4  rounded-lg ">
        <h2 className="font-bold mb-4">Average User Rating:</h2>
        <p className="font-bold text-yellow-400 mb-2">{averageRating} ★</p>
        <div>
          {Array.from({ length: 5 }, (_, i) => 5 - i).map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={star} className="flex items-center mb-1">
                <span className="w-10 text-sm">{star} ★</span>
                <div className="flex-1 bg-gray-300 dark:bg-gray-800 rounded h-3 ml-2 relative">
                  <div className="bg-yellow-400 h-3 rounded" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-8 text-sm text-right ml-2">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
</div>

<div className="w-full max-w-4xl mt-8 flex flex-col items-baseline">
        {/* Add Review Button */}
        {user && (
          <button onClick={toggleModal} className="mt-6 w-full md:w-auto bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Add a Review
          </button>
        )}

        {/* Reviews Section */}
        <div className="border-t border-b w-full max-w-4xl mt-4 flex flex-col gap-4 border-gray-200 dark:border-gray-800" >


          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-black shadow-md rounded-lg p-4 ">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-gray-800 dark:text-gray-400">{getDisplayName(review.email ?? undefined)}</strong>
                  <span className="text-yellow-400 font-semibold">{review.rating} ★</span>
                </div>
                <p className="text-black dark:text-white font-bold mb-2">{review.review_text}</p>
                <p className="text-xs text-gray-400 mb-2">{new Date(review.created_at).toLocaleDateString("hr-HR")}</p>
                {user && review.user_id === user.id && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(review)} className="text-blue-500 hover:text-blue-700 text-md">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-700 text-md">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
</div>
      {/* Footer */}
      <footer className="w-full mt-12">
        <Footer />
      </footer>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg w-full max-w-md relative">
            <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">{editReviewId ? "Edit Review" : "Write a Review"}</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-2xl ${newReview.rating >= star ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-500 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Your Review:</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full p-2 border dark:bg-gray-800 border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-yellow-300"
                  rows={4}
                  placeholder="Write your review..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={toggleModal} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600">
                  {editReviewId ? "Save Changes" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
