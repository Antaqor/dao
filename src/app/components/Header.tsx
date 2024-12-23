// components/Header.tsx

"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    {/* Logo / Brand Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
              <span className="flex items-center cursor-pointer">
                {/* Replace with your logo if available */}
                  <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-semibold text-black">Baba</span>
              </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link href="/salons">
              <span className="text-black hover:text-blue-600 transition duration-300 cursor-pointer">
                Salons
              </span>
                        </Link>

                        {session?.user?.role === "owner" && (
                            <Link href="/dashboard">
                <span className="text-black hover:text-blue-600 transition duration-300 cursor-pointer">
                  Dashboard
                </span>
                            </Link>
                        )}
                    </nav>

                    {/* Right-Aligned Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session?.user ? (
                            <>
                                <span className="text-black">Hello, {session.user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                  <span className="text-black hover:text-blue-600 transition duration-300 cursor-pointer">
                    Login
                  </span>
                                </Link>
                                <Link href="/register">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 cursor-pointer">
                    Register
                  </span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        {/* Hidden Checkbox */}
                        <input type="checkbox" id="menu-toggle" className="hidden peer" />
                        {/* Hamburger Label */}
                        <label htmlFor="menu-toggle" className="cursor-pointer" aria-label="Toggle Menu">
                            <svg
                                className="w-6 h-6 text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>

                        {/* Mobile Navigation Menu */}
                        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden transition-transform duration-300 origin-top transform scale-y-0 peer-checked:scale-y-100">
                            <div className="flex flex-col items-center space-y-4 py-4">
                                <Link href="/salons">
                  <span className="text-black hover:text-blue-600 transition duration-300 cursor-pointer">
                    Salons
                  </span>
                                </Link>

                                {session?.user?.role === "owner" && (
                                    <Link href="/dashboard">
                    <span className="text-black hover:text-blue-600 transition duration-300 cursor-pointer">
                      Dashboard
                    </span>
                                    </Link>
                                )}

                                {session?.user ? (
                                    <>
                                        <span className="text-black">Hello, {session.user.username}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                      <span className="text-black hover:text-blue-600 transition duration-300 cursor-pointer">
                        Login
                      </span>
                                        </Link>
                                        <Link href="/register">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 cursor-pointer">
                        Register
                      </span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}