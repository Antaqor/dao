"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/auth/login");
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            {/* Logo / Brand Name */}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => router.push("/")}
            >
                {/* You can replace the placeholder icon below with an actual Image tag */}
                <div className="h-8 w-8 bg-gray-200 rounded mr-2 flex items-center justify-center">
                    {/* Example placeholder “U” icon or your brand logo */}
                    <span className="font-bold text-blue-600">U</span>
                </div>
                <span className="text-xl font-semibold text-gray-800">Baba</span>
            </div>

            {/* Centered Navigation (inspired by the Jettwave screenshot) */}
            <nav className="hidden md:flex space-x-8">
                <button
                    onClick={() => router.push("/salons")}
                    className="text-gray-700 hover:text-gray-900 transition"
                >
                    Salons
                </button>

                {session?.user?.role === "owner" && (
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-gray-700 hover:text-gray-900 transition"
                    >
                        Dashboard
                    </button>
                )}
            </nav>

            {/* Right-Aligned Actions */}
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="text-gray-700 hover:text-gray-900 transition"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => router.push("/auth/register")}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Try Baba for free
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}