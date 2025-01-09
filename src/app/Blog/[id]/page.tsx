import { Metadata } from "next";
import type { Post } from "../page"; // Assuming you have a Post type defined in the page.tsx
import { notFound } from "next/navigation"; // For 404 handling


export const metadata: Metadata = {
  title: "Post Details",
};

// Define the type for PostProps with params as a Promise
type PostProps = {
  params: Promise<{ id: string }>;  // Now params is a Promise
};

// Fetch a single post by id
async function getPostById(id: string): Promise<Post | null> {
  const response = await fetch(`${process.env.BASE_API_URL}/posts/${id}`);
  if (!response.ok) {
    return null;  // Return null if the post is not found
  }
  return response.json();
}

// Post details page
export default async function PostPage({ params }: PostProps) {
  const resolvedParams = await params; // Await the promise to get the actual params object
  const { id } = resolvedParams;

  // Fetch the post by id
  const post = await getPostById(id);

  // If the post is not found, show a 404 page
  if (!post) {
    notFound(); // This will trigger a 404 page
  }

  const { title, body } = post;

  return (
    <main className="flex min-h-screen flex-col items-center p-10 mt-24">
      <h1 className="text-4xl font-extrabold tracking-tight mb-6">Post {id}</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-700">{body}</p>
      </div>
    </main>
  );
}