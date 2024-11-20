"use client";

import { Navigation } from "../components/Navigation";  // Assuming the Navigation component is already created

export default function SignInRegister() {

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navigation />

      {/* Page Content */}
      <div className="flex flex-grow justify-center items-center mt-32 mx-4">
        {/* Form Section */}
        <div className="w-full max-w-md">
          
          <div className="flex justify-center mb-6 rounded-lg ">
            <button className="w-1/2 py-2 font-semibold text-lg shadow-lg rounded-lg border hover:bg-yellow-400">
              Sign In
            </button>
            <button className="w-1/2 py-2 font-semibold text-lg shadow-lg rounded-lg border hover:bg-yellow-500">
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center text-sm text-gray-400 pb-6">
        <p>&copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
