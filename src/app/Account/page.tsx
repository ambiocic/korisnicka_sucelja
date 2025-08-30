'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from '@/app/components/Logo';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
      router.push('/Account/dashboard');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
      alert('Provjeri email za potvrdu registracije!');
      setActiveTab('login');
      router.push('/Account/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-6 w-96">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Lozinka"
            className="border p-2 w-full mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Potvrdi lozinku"
            className="border p-2 w-full mb-3 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={activeTab === 'register'}
            style={{ display: activeTab === 'register' ? 'block' : 'none' }}
            disabled={activeTab === 'login'}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            {activeTab === 'login' ? 'Log in' : 'Register'}
          </button>
        </form>
        
      </div>
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
                      <a href="/Blog" className="hover:text-yellow-400">
                        Blog
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
