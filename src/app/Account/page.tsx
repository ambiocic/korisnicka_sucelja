"use client";

import { Navigation } from "../components/Navigation";  // Assuming the Navigation component is already created

export default function SignInRegister() {
  return (
    <div className="bg-background dark:bg-gray-900 text-foreground dark:text-white min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="flex flex-grow justify-center items-center mt-32 mx-4">
        {/* Form Section */}
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6 rounded-lg">
            <button className="w-1/2 py-2 font-semibold text-lg shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-yellow-400 dark:hover:bg-yellow-400 hover:text-gray-900 dark:hover:text-black transition-colors">
              Sign In
            </button>
            <button className="w-1/2 py-2 font-semibold text-lg shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-yellow-500 dark:hover:bg-yellow-500 hover:text-gray-900 dark:hover:text-black transition-colors">
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center text-sm text-gray-400 dark:text-gray-500 pb-6">
        <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
