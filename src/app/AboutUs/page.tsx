"use client";

import { Navigation } from "../components/Navigation";  // Assuming the Navigation component is already created
import { Logo } from "../components/Logo";  // Assuming the Logo component is already created
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

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

      
      </div>
        {/* Footer Section */}
      {/* Footer */}
           <footer className="bg-gray-800 text-white py-8">
             <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-around items-center gap-8">
               <div className="flex items-center h-full">
                 <Logo />
               </div>
               <div className="text-center md:text-left">
                 <h3 className="text-lg font-bold mb-4">Sitemap</h3>
                 <ul>
                   <li className="mb-2">
                     <a href="/Movies" className="hover:text-yellow-400">
                       Movies
                     </a>
                   </li>
                   <li className="mb-2">
                     <a href="/TVShows" className="hover:text-yellow-400">
                       TV Shows
                     </a>
                   </li>
                   <li className="mb-2">
                     <a href="/Account" className="hover:text-yellow-400">
                       Account
                     </a>
                   </li>
                   <li className="mb-2">
                     <a href="/AboutUs" className="hover:text-yellow-400">
                       About Us
                     </a>
                   </li>
                 </ul>
               </div>
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
                 <div className="flex space-x-4 justify-center md:justify-start mt-4">
                   <a href="#" className="text-white hover:text-yellow-400">
                     <FaFacebook size={24} />
                   </a>
                   <a href="#" className="text-white hover:text-yellow-400">
                     <FaTwitter size={24} />
                   </a>
                   <a href="#" className="text-white hover:text-yellow-400">
                     <FaInstagram size={24} />
                   </a>
                   <a href="#" className="text-white hover:text-yellow-400">
                     <FaLinkedin size={24} />
                   </a>
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
