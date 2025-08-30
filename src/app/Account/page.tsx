'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

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
    </div>
  );
}
