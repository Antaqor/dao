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
        <header className="bg-black text-white p-4 flex justify-between items-center">
            <div onClick={() => router.push("/")} className="cursor-pointer font-bold text-xl">
                Baba
            </div>
            <div className="space-x-3">
                {/* Public Link to /salons */}
                <button
                    onClick={() => router.push("/salons")}
                    className="bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded"
                >
                    Salons
                </button>

                {/* If user is owner, show Dashboard */}
                {session?.user?.role === "owner" && (
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded"
                    >
                        Dashboard
                    </button>
                )}

                {session?.user ? (
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded">
                        Logout
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push("/auth/register")}
                            className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded"
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}