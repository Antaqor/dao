import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react'; // Removed signIn as it's no longer used
import logo from '../img/logo.svg';
import Image from 'next/image';

const Header: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Handle navigation to specific pages
    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <header className="bg-black text-white py-3 shadow-md border-b border-gray-800">
            <div className="container max-w-screen-lg mx-auto flex justify-between items-center px-6">
                {/* Logo Section */}
                <div
                    className="text-xl font-bold flex items-center gap-2 cursor-pointer"
                    onClick={() => handleNavigation('/')}
                >
                    <Image src={logo} alt="Vone Logo" className="h-10 w-10 object-contain" />
                </div>

                {/* Authentication Buttons */}
                <div className="flex items-center space-x-4">
                    {status === 'loading' ? (
                        <button
                            aria-label="Loading"
                            className="bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-all hover:bg-gray-500"
                        >
                            Loading...
                        </button>
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            aria-label="Sign Out"
                            className="bg-gray-800 text-white font-semibold py-2 px-6 border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:text-blue-400"
                        >
                            Гарах
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => handleNavigation('/login')}
                                aria-label="Login"
                                className="bg-gray-800 text-white font-semibold py-2 px-6 border border-gray-700 transition-all duration-200 hover:bg-gray-700 hover:text-blue-400"
                            >
                                Нэвтрэх
                            </button>
                            <button
                                onClick={() => handleNavigation('/register')}
                                aria-label="Register"
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
