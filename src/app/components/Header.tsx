import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';

const Header: React.FC = () => {
    const router = useRouter();

    return (
        <header className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto flex justify-between items-center px-4 py-2">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-black cursor-pointer" onClick={() => router.push('/')}>
                        VONE CLAN
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="hidden md:flex space-x-6 text-sm font-medium">
                    <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/community')}>
                        Community
                    </span>
                    <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/classroom')}>
                        Classroom
                    </span>
                    <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/calendar')}>
                        Calendar
                    </span>
                    <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/members')}>
                        Members
                    </span>
                </div>

                {/* Search and Mobile Menu Icons */}
                <div className="flex items-center space-x-4">
                    <AiOutlineMenu className="text-xl text-gray-600 cursor-pointer md:hidden" />
                </div>
            </div>
        </header>
    );
};

export default Header;