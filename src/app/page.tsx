"use client";

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Newsfeed from './components/Newsfeed';
import Image from 'next/image';

const HomePage = () => {
    const { data: session, status } = useSession();
    const [loadingSignOut, setLoadingSignOut] = useState(false);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-800">Loading...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Тавтай морил! Vone DAO
                </h1>
                <button
                    onClick={() =>
                        signIn('credentials', {
                            redirect: true,
                            callbackUrl: 'http://152.42.243.146:5000/dashboard', // Hardcoded IP
                        })
                    }
                    className="mt-8 text-white bg-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                    Sign in with Google
                </button>
            </div>
        );
    }

    if (status === 'authenticated' && session) {
        return (
            <div className="bg-gray-100 w-full">
                <div className="container max-w-screen-lg mx-auto flex flex-col items-center justify-center flex-grow py-12">
                    <>
                        {/* Newsfeed Section */}
                        <Newsfeed />

                        {/* User Profile Section */}
                        <div className="flex flex-col items-center mt-10 bg-white p-6 rounded-md shadow-md w-full max-w-md">
                            <Image
                                src={session.user?.image || "/default-avatar.png"}
                                alt="Profile Picture"
                                width={112}
                                height={112}
                                className="rounded-full shadow-md mb-4"
                            />
                            <p className="text-2xl font-semibold text-gray-800 mb-2">
                                Тавтай морил!, {session.user?.name?.replace(/'/g, "&apos;")}!
                            </p>
                            <p className="text-gray-600">{session.user?.email}</p>
                            <button
                                onClick={async () => {
                                    setLoadingSignOut(true);
                                    await signOut({ redirect: true, callbackUrl: 'http://152.42.243.146:5000/login' }); // Hardcoded IP
                                    setLoadingSignOut(false);
                                }}
                                className={`mt-6 text-white px-4 py-2 rounded-md transition ${
                                    loadingSignOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                }`}
                                disabled={loadingSignOut}
                            >
                                {loadingSignOut ? 'Signing Out...' : 'Sign Out'}
                            </button>
                        </div>
                    </>
                </div>
            </div>
        );
    }

    // Handle unexpected errors
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <p className="text-xl text-red-600">An error occurred while loading the page. Please try again later.</p>
        </div>
    );
};

export default HomePage;