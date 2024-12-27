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
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
            {/* Single Row = 64px total */}
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left side: Brand only (removed location) */}
                <div className="flex items-center space-x-6">
                    {/* Brand/Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="h-8 w-8 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors">
                            <span className="text-gray-700 font-semibold text-sm">B</span>
                        </div>
                        <span className="text-gray-800 text-base font-semibold tracking-wide">
              MyBrand
            </span>
                    </Link>
                </div>

                {/* Right side: Desktop nav */}
                <div className="hidden md:flex items-center space-x-6">
                    <HeaderLink href="/salons" label="Salons" />
                    {session?.user?.role === "owner" && (
                        <HeaderLink href="/dashboard" label="Dashboard" />
                    )}

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

                {/* Mobile menu (hamburger/close) */}
                <MobileMenu />
            </nav>
        </header>
    );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors"
        >
            {label}
        </Link>
    );
}

function MobileMenu() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            {open && (
                <div className="absolute top-16 right-0 w-48 bg-white border border-gray-200 shadow-md p-4">
                    <div className="flex flex-col space-y-4">
                        {/* Mobile nav links */}
                        <Link
                            href="/salons"
                            onClick={() => setOpen(false)}
                            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                        >
                            Salons
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