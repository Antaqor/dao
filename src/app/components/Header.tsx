// app/components/Header.tsx
"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        // Fixed header with light bottom border for a minimalist look
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link href="/" className="flex items-center space-x-2 group">
                    {/* Simple brand initial in a subtle circle */}
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        <span className="text-gray-700 font-semibold text-sm">S</span>
                    </div>
                    <span className="text-gray-800 text-base font-semibold tracking-wide">
            Salon
          </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <HeaderLink href="/salons" label="Salons" />
                    <HeaderLink href="/categories" label="Categories" />
                    {session?.user?.role === "owner" && (
                        <HeaderLink href="/dashboard" label="Dashboard" />
                    )}
                </div>

                {/* Right side buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {session?.user ? (
                        <>
              <span className="text-sm text-gray-600">
                Hello, {session.user.username}
              </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-600 hover:underline focus:outline-none"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <HeaderLink href="/login" label="Login" />
                            <HeaderLink href="/register" label="Register" />
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <MobileMenu />
            </nav>
        </header>
    );
}

/** Minimal link style for the header (desktop). */
function HeaderLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline
                 transition-colors"
        >
            {label}
        </Link>
    );
}

/** A simple mobile menu component. */
function MobileMenu() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <div className="md:hidden flex items-center">
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            {open && (
                <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-sm p-4">
                    <div className="flex flex-col space-y-4">
                        <Link
                            href="/salons"
                            onClick={() => setOpen(false)}
                            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                        >
                            Salons
                        </Link>
                        <Link
                            href="/categories"
                            onClick={() => setOpen(false)}
                            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                        >
                            Categories
                        </Link>
                        {session?.user?.role === "owner" && (
                            <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                            >
                                Dashboard
                            </Link>
                        )}
                        {/* Auth actions */}
                        {session?.user ? (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    handleLogout();
                                }}
                                className="text-left text-sm text-gray-600 hover:text-gray-800 hover:underline"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}