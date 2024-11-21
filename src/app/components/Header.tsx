// src/app/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-black text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo Section */}
                <div className="text-3xl font-bold flex items-center gap-1">
                    <span className="text-neon-green">THE</span>
                    <span className="tracking-widest font-black">WOLVES.DAO</span>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-8 text-lg font-semibold">
                    <a href="#rules" className="hover:text-gray-400 transition-colors">ДҮРЭМ</a>
                    <a href="#discussions" className="hover:text-gray-400 transition-colors">ХЭЛЭЛЦҮҮЛЭГ</a>
                    <a href="#suggestions" className="hover:text-gray-400 transition-colors">САНАЛ ХҮСЭЛТ</a>
                </nav>

                {/* Login Button */}
                <div>
                    <a
                        href="#login"
                        className="bg-neon-yellow text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors"
                    >
                        Нэвтрэх
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
