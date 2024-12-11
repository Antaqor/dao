import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import logo from '../img/logo.svg';
import Image from 'next/image';
import { FaSun, FaMoon, FaCloudSun } from 'react-icons/fa';

const Header: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();

    // Determine greeting based on time of day
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return { text: 'Өглөөний мэнд', icon: <FaSun className="text-yellow-400 text-lg" /> };
        } else if (currentHour >= 12 && currentHour < 18) {
            return { text: 'Өдрийн мэнд', icon: <FaCloudSun className="text-orange-400 text-lg" /> };
        } else {
            return { text: 'Шөнийн мэнд', icon: <FaMoon className="text-blue-400 text-lg" /> };
        }
    };

    const greeting = getGreeting();

    return (
        <header className="bg-black text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-6 py-3">
                {/* Logo */}
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push('/')}
                >
                    <Image src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                </div>

                {/* Greeting and User Profile */}
                <div className="flex items-center space-x-4">
                    {/* Greeting with Icon */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-2">
                            {greeting.icon}
                            <span className="text-sm font-semibold">{greeting.text}</span>
                        </div>
                        {session?.user?.username && (
                            <span className="text-xs text-gray-400">{session.user.username}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;