"use client";

import { Navigation } from "../components/Navigation";  // Assuming the Navigation component is already created

export default function AboutUs() {
  return (
    <div className="bg-background dark:bg-gray-900 text-foreground dark:text-white min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="mt-32 mx-4">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 mb-4 mx-4 mt-24">
          <div className="absolute border rounded-lg inset-0 bg-background dark:bg-gray-800 shadow-lg flex flex-col justify-center items-start p-6">
            <h1 className="text-foreground dark:text-white text-3xl md:text-5xl font-extrabold mb-4">
              About <span className="text-yellow-400">Us</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-lg">
              Learn more about FilmNest and the team behind it!
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="text-center text-sm text-gray-400 dark:text-gray-500 pb-6">
          <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
