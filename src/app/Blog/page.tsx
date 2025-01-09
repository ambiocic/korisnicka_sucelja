import { Metadata } from "next";
import Link from "next/link";

// Define the Post type
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Define the type for BlogPageProps with searchParams as a Promise
type BlogPageProps = {
  searchParams: Promise<{ page: string }>;
};

type PagingInfo = {
  _start?: number;
  _limit?: number;
};

type PaginationProps = {
  currentPage: number;
  pagesCount: number;
};

export const metadata: Metadata = {
  title: "Blog",
};

// Define the page size for pagination
const PAGE_SIZE = 12;

// Fetch posts for the current page
async function getPosts({
  _start = 0,
  _limit = PAGE_SIZE,
}: PagingInfo): Promise<Post[]> {
  const res = await fetch(
    `${process.env.BASE_API_URL}/posts?_start=${_start}&_limit=${_limit}`
  );
  return res.json();
}

// Fetch total number of posts
async function getPostsCount(): Promise<number> {
  const res = await fetch(`${process.env.BASE_API_URL}/posts?_limit=1`, {
    method: "HEAD",
  });
  const count = res.headers.get("x-total-count");
  return count ? parseInt(count, 10) : 0;
}

// Render individual post
function processPost(post: Post) {
  const { id, title } = post;
  return (
    <li key={id} className="mb-4">
      <Link
        href={`/Blog/${id}`}
        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
      >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Post {id}: {title}
        </h2>
      </Link>
    </li>
  );
}

// Pagination component
function Pagination({ currentPage, pagesCount }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pagesCount;

  return (
    <div className="w-full max-w-2xl mb-6 mt-4">
      <div className="bg-white p-4 flex justify-between items-center">
        <Link
          href={`/Blog?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded-md transition-colors duration-100 ${
            isFirstPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-disabled={isFirstPage}
        >
          
        </Link>
        <p className="text-gray-700">
          Page{" "}
          <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900">{pagesCount}</span>
        </p>
        <Link
          href={`/Blog?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded-md transition-colors duration-100 ${
            isLastPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-disabled={isLastPage}
        >
        </Link>
      </div>
    </div>
  );
}

// Main BlogPage component
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams; // Await the promise to resolve
  const page = resolvedSearchParams.page || "1";

  const postsCount = await getPostsCount();
  const pagesCount = Math.ceil(postsCount / PAGE_SIZE);
  const currentPage = Math.min(
    /^[1-9][0-9]*$/.test(page) ? Number(page) : 1,
    pagesCount
  );
  const _start = (currentPage - 1) * PAGE_SIZE;
  const _limit = PAGE_SIZE;

  const posts = await getPosts({ _start, _limit });

  return (
    <main className="flex min-h-screen flex-col items-center p-10 mt-24">
      <ul className="w-full max-w-2xl space-y-4">{posts.map(processPost)}</ul>

      {/* Pagination at the bottom */}
      <Pagination currentPage={currentPage} pagesCount={pagesCount} />
    </main>
  );
}