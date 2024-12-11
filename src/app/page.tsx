// app/page.tsx

"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Newsfeed from './components/Newsfeed';

const HomePage = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <p className="text-xl text-white">Loading...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <h1 className="font-bold text-white mb-6">
                    Hi! Тавтай морил! Vone DAO
                </h1>
            </div>
        );
    }

    if (status === 'authenticated' && session) {
        return (
            <div className="w-full bg-black">
                <Newsfeed />
            </div>
        );
    }

    // Handle unexpected errors
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <p className="text-xl text-red-600">An error occurred while loading the page. Please try again later.</p>
        </div>
    );
};

export default HomePage;