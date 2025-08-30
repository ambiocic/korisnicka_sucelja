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

  console.log("Fetched reviews:", data); // Debugging
  return (data as Review[]) || [];
}

export default function TVShowPage({ params }: PostProps) {
  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newReview, setNewReview] = useState<{ rating: number; text: string }>({ rating: 0, text: "" });
  const [editReview, setEditReview] = useState<{ [key: number]: { rating: number; text: string } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Fetch TV show
        const tvShowData = await getTVShowById(id);
        if (!tvShowData) {
          notFound();
        }
        setMedia(tvShowData);

        // Fetch reviews
        const reviewsData = await getReviews(id);
        setReviews(reviewsData);

        // Fetch user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.log("Error fetching user:", userError);
          setUser(null);
        } else if (userData?.user) {
          setUser(userData.user);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error("Unexpected error in fetchData:", error);
      setLoading(false);
      notFound();
    });
  }, [params]);

  // Real-time subscription for reviews
  useEffect(() => {
    if (!media) return;

    const subscription = supabase
      .channel(`reviews_tv_show_${media.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
          filter: `tv_show_id=eq.${media.id}`,
        },
        (payload) => {
          console.log("Real-time update:", payload);
          getReviews(media.id.toString()).then((reviewsData) => {
            setReviews(reviewsData);
          });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [media]);

  // Handle review submission
  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to submit a review.");
      return;
    }
    if (!media) {
      alert("TV show not found.");
      return;
    }

    const { rating, text } = newReview;
    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    if (!text.trim()) {
      alert("Please enter a review.");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        user_id: user.id,
        tv_show_id: media.id,
        movie_id: null,
        rating,
        review_text: text,
      },
    ]);

    if (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review: " + (error.message || "Unknown error"));
    } else {
      alert("Review submitted successfully!");
      setNewReview({ rating: 0, text: "" });
      const reviewsData = await getReviews(media.id.toString());
      setReviews(reviewsData);
    }
  };

  // Handle review update
  const handleReviewUpdate = async (reviewId: number, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to update a review.");
      return;
    }

    const { rating, text } = editReview[reviewId] || { rating: 0, text: "" };
    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    if (!text.trim()) {
      alert("Please enter a review.");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .update({ rating, review_text: text })
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review: " + (error.message || "Unknown error"));
    } else {
      alert("Review updated successfully!");
      setEditReview((prev) => {
        const newEditReview = { ...prev };
        delete newEditReview[reviewId];
        return newEditReview;
      });
      const reviewsData = await getReviews(media!.id.toString());
      setReviews(reviewsData);
    }
  };

  // Handle review deletion
  const handleReviewDelete = async (reviewId: number) => {
    if (!user) {
      alert("Please sign in to delete a review.");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review: " + (error.message || "Unknown error"));
    } else {
      alert("Review deleted successfully!");
      const reviewsData = await getReviews(media!.id.toString());
      setReviews(reviewsData);
    }
  };

  // Handle review input changes
  const handleReviewChange = (field: "rating" | "text", value: string | number) => {
    setNewReview((prev) => ({ ...prev, [field]: value }));
  };

  // Handle review edit changes
  const handleReviewEditChange = (reviewId: number, field: "rating" | "text", value: string | number) => {
    setEditReview((prev) => ({
      ...prev,
      [reviewId]: {
        rating: prev[reviewId]?.rating ?? 0,
        text: prev[reviewId]?.text ?? "",
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-10 mt-24">
        <div className="w-full max-w-2xl bg-gray-200 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 shadow-md animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </main>
    );
  }

  if (!media) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10 mt-24">
      <div className="w-full max-w-2xl p-6 rounded-lg  shadow-md">
        {media.image && (
          <div className="relative w-full aspect-[3/4] mb-4">
            <Image
              src={media.image}
              alt={media.title}
              width={300}
              height={400}
              style={{ objectFit: "cover" }}
              className="w-full h-full rounded"
              unoptimized
            />
          </div>
        )}
        <h2 className="text-2xl font-extrabold mb-2">{media.title}</h2>
        <p className=" mb-2 font-bold">Genre: {media.genre || "N/A"}</p>
        <p className="mb-4 font-bold">Release Year: {media.release_year || "N/A"}</p>

        {/* Review Form */}
        {user && (
          <form onSubmit={handleReviewSubmit} className="mb-6">
            <h3 className="text-lg font-bold mb-2">Write a Review</h3>
            <div className="mb-2">
              <label className="block text-sm ">Rating (1–5):</label>
              <select
                value={newReview.rating || ""}
                onChange={(e) => handleReviewChange("rating", Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm text-gray-500">Your Review:</label>
              <textarea
                value={newReview.text}
                onChange={(e) => handleReviewChange("text", e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Write your review..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Section */}
        <h3 className="text-lg font-bold mb-4">Reviews: </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="mb-4 border-t pt-4">
              <p className="text-sm text-gray-500">
                <strong>{review.user_id.slice(0, 8)}</strong>: {review.rating} ★
              </p>
              <p className="text-sm text-gray-700">{review.review_text}</p>
              <p className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString("hr-HR")}
              </p>
              {user && user.id === review.user_id && (
                <div className="mt-2">
                  <form onSubmit={(e) => handleReviewUpdate(review.id, e)} className="mb-2">
                    <div className="mb-2">
                      <label className="block text-sm text-gray-500">Edit Rating:</label>
                      <select
                        value={editReview[review.id]?.rating || review.rating}
                        onChange={(e) =>
                          handleReviewEditChange(review.id, "rating", Number(e.target.value))
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select rating</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm text-gray-500">Edit Review:</label>
                      <textarea
                        value={editReview[review.id]?.text || review.review_text}
                        onChange={(e) => handleReviewEditChange(review.id, "text", e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                        placeholder="Edit your review..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    >
                      Update Review
                    </button>
                  </form>
                  <button
                    onClick={() => handleReviewDelete(review.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete Review
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        <Link href="/TVShows" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to TV Shows
        </Link>
      </div>
    </main>
  );
}