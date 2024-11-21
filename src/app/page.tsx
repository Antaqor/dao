"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React from 'react';

const HomePage = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div className="text-center">
                <p>You are not signed in.</p>
                <button
                    onClick={() => signIn("google")}
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                >
                    Sign in with Google
                </button>
            </div>
        );
    }

    return (
        <div className="text-center">
            <p>Welcome, {session.user?.name}!</p>
            <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
            >
                Sign out
            </button>
        </div>
    );
};

export default HomePage;
