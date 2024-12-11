// src/app/components/BottomNav.tsx

"use client";
import React from "react";
import {
    HomeIcon,
    PlusCircleIcon,
    BellIcon,
    UserCircleIcon,
    Squares2X2Icon, // Icon for "Services"
} from "@heroicons/react/24/outline";

const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 w-full bg-[#121212] border-t border-gray-700 z-50">
            <div className="flex justify-between items-center px-4 py-3">
                {/* Home Icon */}
                <button className="flex items-center justify-center text-gray-400 hover:text-white transition">
                    <HomeIcon className="h-6 w-6" />
                </button>

                {/* Services Icon */}
                <button className="flex items-center justify-center text-gray-400 hover:text-white transition">
                    <Squares2X2Icon className="h-6 w-6" />
                </button>

                {/* Center Post Button */}
                <div className="relative">
                    <button className="flex items-center justify-center bg-gray-700 text-white rounded-full w-12 h-12 shadow-lg hover:bg-gray-600 transition duration-300 focus:ring-2 focus:ring-gray-600">
                        <PlusCircleIcon className="h-8 w-8" />
                    </button>
                </div>

                {/* Notifications Icon */}
                <button className="flex items-center justify-center text-gray-400 hover:text-white transition">
                    <BellIcon className="h-6 w-6" />
                </button>

                {/* Profile Icon */}
                <button className="flex items-center justify-center text-gray-400 hover:text-white transition">
                    <UserCircleIcon className="h-6 w-6" />
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;