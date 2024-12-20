// app/page.tsx

"use client";

import React from 'react';
import { useSession } from 'next-auth/react';

const HomePage = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-xl text-black">Loading...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <h1 className="font-bold text-black mb-6">
                    Hi! Тавтай морил! Vone DAO
                </h1>
            </div>
        );
    }

    if (status === 'authenticated' && session) {
        return (
            <div className="w-full">
           Hi
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