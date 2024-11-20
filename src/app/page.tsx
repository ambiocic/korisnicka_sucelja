"use client";

import { Navigation } from "./components/Navigation";

const movies = [
  { title: "Inception", image: "inception.jpg", genre: "Sci-Fi" },
  { title: "The Dark Knight", image: "dark-knight.jpg", genre: "Action" },
  { title: "Interstellar", image: "interstellar.jpg", genre: "Sci-Fi" },
];

const tvShows = [
  { title: "Breaking Bad", image: "breaking-bad.jpg", genre: "Drama" },
  { title: "Stranger Things", image: "stranger-things.jpg", genre: "Sci-Fi" },
  { title: "The Crown", image: "the-crown.jpg", genre: "Historical" },
];

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

    <div className="mt-32 mx-4">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-64   mb-4 mx-4 mt-24 " >
        <div className="absolute border rounded-lg inset-0 bg-white shadow-lg flex flex-col justify-center items-start p-6">
          <h1 className="text-black text-3xl md:text-5xl font-extrabold mb-4">Welcome to <span className="text-yellow-400 text-3xl md:text-5xl font-extrabold mb-4">Film</span>Nest</h1>
          <p className="text-gray-400 font-bold text-lg">Discover your next favorite movie or TV show!</p>
        </div>
      </div>

      {/* Recommendations Section */}
      <section className="mb-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img src={movie.image} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-400">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending TV Shows Section */}
      <section className="mb-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tvShows.map((show, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img src={show.image} alt={show.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{show.title}</h3>
                <p className="text-sm text-gray-400">{show.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
      {/* Footer Section */}
      <footer className="text-center text-sm text-gray-400 pb-6">
        <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
