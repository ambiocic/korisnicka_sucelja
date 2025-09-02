"use client";

import { Navigation } from "../components/Navigation";
import { Footer } from "../components/footer";

export default function AboutUs() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-64 mb-2 mx-4 mt-28 rounded-lg overflow-hidden ">
        <div className="relative w-full flex flex-col items-start justify-center py-8 md:py-12 px-4 md:px-6 mb-10 animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-3 leading-tight md:leading-snug tracking-tight dark:text-white">
            About <span className="text-yellow-400">Us</span>
          </h1>
          <p className="text-gray-700 dark:text-white text-lg">
            Learn more about FilmNest and the team behind it!
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-4xl mx-auto mb-16 px-4 space-y-6 text-lg text-gray-700 dark:text-white">
        <p>
          FilmNest is a passionate community of movie and TV show enthusiasts.
          Our mission is to help viewers discover, track, and enjoy the best
          content from around the world. Whether you’re looking for the latest
          blockbuster or a hidden gem, FilmNest has you covered.
        </p>
        <p>
          Our team is composed of dedicated developers, designers, and film
          lovers who share a common goal: to create a seamless experience for
          discovering and enjoying media. We believe that great stories deserve
          to be seen, and our platform is here to make that possible.
        </p>
        <p>
          Join our community today and start exploring! Keep track of your
          favorites, get recommendations, and never miss out on the shows and
          movies you love.
        </p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
