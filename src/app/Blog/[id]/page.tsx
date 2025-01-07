import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Post } from "../page"; 

export const metadata: Metadata = {
  title: "Post Details",
};

// Fetch a single post by id
async function getPostById(id: number): Promise<Post | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

// Post details page
export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id, 10);
  const post = await getPostById(postId);

  if (!post) {
    notFound(); // If the post doesn't exist, show a 404 page
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10 mt-24">
      <h1 className="text-4xl font-extrabold tracking-tight mb-6">Post {post.id}</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
        <p className="text-gray-700">{post.body}</p>
      </div>
    </main>
  );
}
