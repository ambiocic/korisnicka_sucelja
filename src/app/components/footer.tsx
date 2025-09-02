"use client";

import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { Logo } from "./Logo";
import Link from "next/link";

export const Footer = () => {
  const [sitemapOpen, setSitemapOpen] = useState(false);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-around items-center gap-8">
        {/* Logo */}
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <Logo />
        </div>

        {/* Sitemap */}
        <div className="w-full md:w-auto text-center md:text-left">
          <h3
            className="text-lg font-bold mb-2 cursor-pointer md:cursor-auto hover:text-yellow-400"
            onClick={() => setSitemapOpen(!sitemapOpen)}
          >
            Sitemap
          </h3>
          <ul
            className={`mt-2 md:mt-4 space-y-2 ${sitemapOpen ? "block" : "hidden"} md:block text-white text-lg`}
          >
            <li>
              <Link
                href="/Movies"
                className="text-white hover:text-yellow-400 block"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href="/TVShows"
                className="text-white hover:text-yellow-400 block"
              >
                TV Shows
              </Link>
            </li>
            <li>
              <Link
                href="/Account"
                className="text-white hover:text-yellow-400 block"
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                href="/AboutUs"
                className="text-white hover:text-yellow-400 block"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center md:text-left w-full md:w-auto flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <p className="flex items-center justify-center md:justify-start mb-2">
            <FaMapMarkerAlt className="mr-2" />
            <a
              href="https://www.google.com/maps?q=Ruđera+Boškovića+32,+21000+Split,+Hrvatska"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400"
            >
              Ruđera Boškovića 32, 21000 Split, Hrvatska
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start mb-2">
            <FaPhone className="mr-2" />
            <a
              href="tel:+385000000"
              className="text-white hover:text-yellow-400"
            >
              +385 000 000
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start mb-2">
            <FaEnvelope className="mr-2" />
            <a
              href="mailto:filmnest@fesb.hr"
              className="text-white hover:text-yellow-400"
            >
              filmnest@fesb.hr
            </a>
          </p>
          <div className="flex space-x-4 justify-center md:justify-start mt-4">
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-sm mt-8">
        &copy; {new Date().getFullYear()} FilmNest. All Rights Reserved.
      </p>
    </footer>
  );
};
