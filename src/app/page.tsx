"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function HomePage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading session...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to My Salon Booking</h1>
            {session?.user ? (
                <p>Hello, {session.user.username}! You are logged in as {session.user.role}.</p>
            ) : (
                <p>Please log in or register.</p>
            )}
        </div>
    );
}