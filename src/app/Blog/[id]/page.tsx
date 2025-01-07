import { Metadata } from "next";
import type { Post } from "../page"; 
import { BASE_API_URL } from "../page";

export const metadata: Metadata = {
  title: "Post Details",
};
type PostProps = {
  params: { id: string };
};

// Fetch a single post by id
async function getPostById(id: string): Promise<Post> {
  const data = await fetch(`${BASE_API_URL}/posts/${id}`);
  return data.json();
}


// Post details page
export default async function PostPage({ params }: PostProps) {
  const { id } = await params; // Awaiting params
  
  const post = await getPostById(id);
  const { title, body } = post;

  console.log("id, title, body", id, title, body);

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
