"use client";

import { Navigation } from "./components/Navigation";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"; // Import ikona
import { Logo } from "./components/Logo";

const movies = [
  { title: "Inception", image: "inception.jpg", genre: "Sci-Fi" },
  { title: "The Dark Knight", image: "dark-knight.jpg", genre: "Action" },
  { title: "Interstellar", image: "interstellar.jpg", genre: "Sci-Fi" },
  { title: "The Matrix", image: "the-matrix.jpg", genre: "Action" },
  { title: "Avatar", image: "avatar.jpg", genre: "Adventure" },
  { title: "The Prestige", image: "the-prestige.jpg", genre: "Drama" },
  { title: "Shutter Island", image: "shutter-island.jpg", genre: "Thriller" },
];

const tvShows = [
  { title: "Breaking Bad", image: "breaking-bad.jpg", genre: "Drama" },
  { title: "Stranger Things", image: "stranger-things.jpg", genre: "Sci-Fi" },
  { title: "The Crown", image: "the-crown.jpg", genre: "Historical" },
  { title: "Money Heist", image: "money-heist.jpg", genre: "Thriller" },
  { title: "The Witcher", image: "the-witcher.jpg", genre: "Fantasy" },
  { title: "Narcos", image: "narcos.jpg", genre: "Crime" },
  { title: "Black Mirror", image: "black-mirror.jpg", genre: "Sci-Fi" },
];


export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 mb-4 mx-4 mt-24">
          <div className="absolute border rounded-lg inset-0 bg-background shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-foreground text-3xl md:text-5xl font-extrabold mb-4">
              Welcome to{" "}
              <span className="text-yellow-400 text-3xl md:text-5xl font-extrabold mb-4">
                Film
              </span>
              Nest
            </h1>
            <p className="text-gray-500 dark:text-gray-300 font-bold text-lg">
              Discover your next favorite movie or TV show!
            </p>
          </div>
        </div>

        {/* Recommendations Section */}
        <section className="mb-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
        <div className="flex overflow-x-auto space-x-4 scrollbar-hidden">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="bg-background rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex-shrink-0 w-64"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
        </section>

        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
          <div className="flex overflow-x-auto space-x-4 scrollbar-hidden">
            {tvShows.map((show, index) => (
              <div
                key={index}
                className="bg-background rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 flex-shrink-0 w-64"
              >
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{show.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{show.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </section>





        {/* Your Watchlist Section */}
        <section className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
          <div className="bg-background rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-500 dark:text-gray-300 font-bold text-lg mb-4">
              Sign in to access your Watchlist
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Save shows and movies to keep track of what you want to watch.
            </p>
            <button className="bg-yellow-400 text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-around items-center gap-8">
        {/* Logo */}
        <div className="flex items-center h-full">
          <Logo />
        </div>
        {/* Sitemap */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold mb-4">Sitemap</h3>
          <ul>
            <li className="mb-2">Movies</li>
            <li className="mb-2">TV Shows</li>
            <li className="mb-2">Blog</li>
            <li className="mb-2">Account</li>
            <li className="mb-2">About Us</li>
          </ul>
        </div>
        {/* Contact */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <p className="flex items-center justify-center md:justify-start mb-2">
            <FaMapMarkerAlt className="mr-2" /> Ruđera Boškovića 32, 21000 Split, Hrvatska
          </p>
          <p className="flex items-center justify-center md:justify-start mb-2">
            <FaPhone className="mr-2" /> +385 000 000
          </p>
          <p className="flex items-center justify-center md:justify-start mb-2">
            <FaEnvelope className="mr-2" /> filmnest@fesb.hr
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-4 justify-center md:justify-start mt-4">
            <FaFacebook size={24} className="text-white hover:text-yellow-400" />
            <FaTwitter size={24} className="text-white hover:text-yellow-400" />
            <FaInstagram size={24} className="text-white hover:text-yellow-400" />
            <FaLinkedin size={24} className="text-white hover:text-yellow-400" />
          </div>
        </div>
      </div>
      <p className="text-center text-sm mt-8">
        &copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.
      </p>
      </footer>
 </div>
  );
}
