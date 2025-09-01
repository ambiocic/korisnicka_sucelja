"use client";

import { useState, useEffect, FormEvent } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

type Media = {
  id: number;
  title: string;
  image: string | null;
  genre: string | null;
  release_year: number | null;
};

type Review = {
  id: number;
  user_id: string;
  tv_show_id: number;
  rating: number;
  review_text: string;
  created_at: string;
};

type PostProps = {
  params: Promise<{ id: string }>;
};

async function getTVShowById(id: string): Promise<Media | null> {
  const { data, error } = await supabase
    .from("tv_shows")
    .select("id, title, image, genre, release_year")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching TV show:", error);
    return null;
  }

  return data as Media;
}

async function getReviews(tvShowId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, tv_show_id, rating, review_text, created_at")
    .eq("tv_show_id", tvShowId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data as Review[]) || [];
}

export default function TVShowPage({ params }: PostProps) {
  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newReview, setNewReview] = useState<{ rating: number; text: string }>({ rating: 0, text: "" });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      } catch (error) {
        console.error("Error fetching TV show:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleAddToWatchlist = async () => {
    if (!user || !media) {
      alert("Please sign in to add to your watchlist.");
      return;
    }

    const { data: existing } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("tv_show_id", media.id)
      .single();

    if (existing) {
      alert("TV Show is already in your watchlist.");
      return;
    }

    const { error } = await supabase.from("watchlist").insert([
      { user_id: user.id, movie_id: null, tv_show_id: media.id },
    ]);

    if (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add to watchlist.");
    } else {
      alert("TV Show added to your watchlist!");
    }
  };

  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !media) {
      alert("Please sign in to submit a review.");
      return;
    }
    if (!newReview.rating) {
      alert("Please select a rating.");
      return;
    }
    if (!newReview.text.trim()) {
      alert("Please enter a review.");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        user_id: user.id,
        tv_show_id: media.id,
        movie_id: null,
        rating: newReview.rating,
        review_text: newReview.text,
      },
    ]);

    if (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } else {
      alert("Review submitted successfully!");
      setNewReview({ rating: 0, text: "" });
      const reviewsData = await getReviews(media.id.toString());
      setReviews(reviewsData);
      toggleModal();
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-10 mt-24">
        <div className="w-full max-w-2xl bg-gray-200 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 shadow-md animate-pulse"></div>
      </main>
    );
  }

  if (!media) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center p-10 mt-24">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 shadow-md flex flex-col md:flex-row gap-6">
        {media.image && (
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="relative w-full aspect-[2/3] mb-4">
              <Image
                src={media.image}
                alt={media.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
                unoptimized
              />
            </div>
            <button
              onClick={handleAddToWatchlist}
              className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
            >
              Add to Watchlist
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-start">
          <h1 className="text-3xl font-extrabold mb-2">{media.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Genre: {media.genre || "N/A"} | Release Year: {media.release_year || "N/A"}
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-6">
              <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                <p className="text-3xl font-bold text-yellow-400">{averageRating} ★</p>
                <p className="text-gray-600">{reviews.length} reviews</p>
              </div>

              <div className="flex-1 w-full md:w-2/3">
                {Array.from({ length: 5 }, (_, i) => 5 - i).map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={star} className="flex items-center mb-1">
                      <span className="w-10 text-sm">{star} ★</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-3 ml-2 relative">
                        <div
                          className="bg-yellow-400 h-3 rounded"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-right ml-2">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    <strong>{review.user_id.slice(0, 8)}</strong>: {review.rating} ★
                  </p>
                  <p className="text-sm text-gray-700">{review.review_text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString("hr-HR")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="w-full flex justify-between mt-6">
          {user && (
            <button
              onClick={toggleModal}
              className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500"
            >
              Add a Review
            </button>
          )}
          <Link href="/TVShows" className="text-gray-800 hover:underline">
            Back to TV Shows
          </Link>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
              <button
                onClick={toggleModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h3 className="text-lg font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Rating:</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`text-2xl ${
                          newReview.rating >= star ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-500 transition-colors`}
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
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                    rows={4}
                    placeholder="Write your review..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
