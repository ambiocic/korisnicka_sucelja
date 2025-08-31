"use client";

import { Navigation } from "../components/Navigation";  
import { Footer } from "../components/footer";

export default function AboutUs() {
  return (
    <div className="bg-background dark:bg-gray-900 text-foreground dark:text-white min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 mb-8 mx-4 mt-24">
          <div className="absolute border rounded-lg inset-0 bg-background dark:bg-gray-800 shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-foreground dark:text-white text-3xl md:text-5xl font-extrabold mb-4">
              About <span className="text-yellow-400">Us</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-lg">
              Learn more about FilmNest and the team behind it!
            </p>
          </div>
        </div>

        {/* About Section */}
        <section className="max-w-4xl mx-auto mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Who Are We
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            FilmNest is a passionate community of movie and TV show enthusiasts.
            Our mission is to help viewers discover, track, and enjoy the best
            content from around the world. Whether you’re looking for the latest
            blockbuster or a hidden gem, FilmNest has you covered.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            Our team is composed of dedicated developers, designers, and film
            lovers who share a common goal: to create a seamless experience for
            discovering and enjoying media. We believe that great stories deserve
            to be seen, and our platform is here to make that possible.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            Join our community today and start exploring! Keep track of your
            favorites, get recommendations, and never miss out on the shows and
            movies you love.
          </p>
        </section>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
