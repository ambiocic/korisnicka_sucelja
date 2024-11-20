// components/Logo.tsx
import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center text-xl font-extrabold">
      <Link
        href="/"
        className="hover:underline underline-offset-4 hover: rounded-full px-3 py-2 flex items-center text-yellow-400  transition-all duration-300"
      >
        <span className="text-yellow-400">Film</span>
        <span className="text-white">Nest</span>
      </Link>
    </div>
  );
}
