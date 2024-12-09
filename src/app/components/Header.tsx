import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import logo from '../img/logo.svg';
import Image from 'next/image';

const Header: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle navigation
    const handleNavigation = (path: string) => {
        router.push(path);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    };

    return (
        <header className="bg-black text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-6 py-3">
                {/* Logo */}
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleNavigation('/')}
                >
                    <Image src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                    <span className="ml-3 font-bold text-lg">Vone</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 items-center">
                    <button
                        onClick={() => handleNavigation('/newsfeed')}
                        className="hover:text-gray-300 transition duration-150"
                    >
                        Newsfeed
                    </button>
                    <button
                        onClick={() => handleNavigation('/service')}
                        className="hover:text-gray-300 transition duration-150"
                    >
                        Service
                    </button>
                    <button
                        onClick={() => handleNavigation('/profile')}
                        className="hover:text-gray-300 transition duration-150"
                    >
                        Profile
                    </button>

                    {/* Auth Buttons */}
                    {status === 'loading' ? (
                        <button className="text-gray-400">Loading...</button>
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-150"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-150"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleNavigation('/register')}
                                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-150"
                            >
                                Register
                            </button>
                        </>
                    )}
                </nav>

                {/* Mobile Burger Menu */}
                <div className="md:hidden">
                    <button
                        className="text-white focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="bg-black text-white fixed top-0 left-0 w-full h-screen z-50 flex flex-col items-center justify-center space-y-6">
                    <button
                        onClick={() => handleNavigation('/newsfeed')}
                        className="text-xl hover:text-gray-300 transition duration-150"
                    >
                        Newsfeed
                    </button>
                    <button
                        onClick={() => handleNavigation('/service')}
                        className="text-xl hover:text-gray-300 transition duration-150"
                    >
                        Service
                    </button>
                    <button
                        onClick={() => handleNavigation('/profile')}
                        className="text-xl hover:text-gray-300 transition duration-150"
                    >
                        Profile
                    </button>

                    {/* Auth Buttons */}
                    {status === 'loading' ? (
                        <button className="text-gray-400 text-lg">Loading...</button>
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-150"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-150"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleNavigation('/register')}
                                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-150"
                            >
                                Register
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-gray-400 hover:text-gray-300 mt-6"
                    >
                        Close
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;