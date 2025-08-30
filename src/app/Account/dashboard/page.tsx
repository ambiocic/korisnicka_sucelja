'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push('/Account');
            } else {
                setUser(data.user);
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/Account');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">
                Dobrodošao, {user?.email || 'Korisnik'}
            </h1>
            {user && (
                <div className="bg-white shadow rounded p-6 mb-6 w-full max-w-md">
                    <p><strong>ID korisnika:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p>
                        <strong>Račun kreiran:</strong>{' '}
                        {user.created_at
                            ? new Date(user.created_at).toLocaleString()
                            : 'Nepoznato'}
                    </p>
                </div>
            )}
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Odjavi se
            </button>
        </div>
    );
}
