// components/Logo.tsx
import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center text-xl font-extrabold">
      <Link
        href="/"
        className="hover:scale-110 transition-transform duration-300 flex items-center"
      >
        <span className="text-yellow-400">Film</span>
        <span className="text-white">Nest</span>
      </Link>
    </div>
  );
}
