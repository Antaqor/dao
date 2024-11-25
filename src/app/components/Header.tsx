"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import logo from '../img/vone.svg'
const Header: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Handle navigation to login page
    const handleLoginClick = () => {
        router.push('/login');
    };

    // Handle navigation to register page
    const handleRegisterClick = () => {
        router.push('/register');
    };

    return (
        <header className="bg-black text-white py-3 shadow-md border-b border-gray-800">
            <div className="container max-w-screen-lg mx-auto flex justify-between items-center px-6">
                {/* Logo Section */}
                <div className="text-xl font-bold flex items-center gap-2 cursor-pointer"
                     onClick={() => router.push('/')}>
                    <img src={logo.src} alt="Vone Logo" className="h-10 w-10 object-contain"/>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-6 text-base font-medium">
                    <a href="#newsfeed" className="hover:text-gray-400 transition duration-200">Мэдээ</a>
                    <a href="#marketplace" className="hover:text-gray-400 transition duration-200">Худалдаа</a>
                    <a href="#services" className="hover:text-gray-400 transition duration-200">Үйлчилгээ</a>
                    <a href="#events" className="hover:text-gray-400 transition duration-200">Үйл явдал</a>
                </nav>

                {/* Authentication Buttons */}
                <div className="flex items-center space-x-4">
                    {status === 'loading' ? (
                        <button className="bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-all hover:bg-gray-500">
                            Loading...
                        </button>
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            className="bg-gray-800 text-white font-semibold py-2 px-6 border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:text-blue-400"
                        >
                            Гарах
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleLoginClick}
                                className="bg-gray-800 text-white font-semibold py-2 px-6 border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:text-blue-400"
                            >
                                Нэвтрэх
                            </button>
                            <button
                                onClick={handleRegisterClick}
                                className="bg-gray-800 text-white font-semibold py-2 px-6 border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:text-blue-400"
                            >
                                Бүртгүүлэх
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;