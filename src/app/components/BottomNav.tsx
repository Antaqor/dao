import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineHome, AiOutlineUser, AiOutlineAppstore } from 'react-icons/ai';

const BottomNav: React.FC = () => {
    const router = useRouter();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black shadow-md border-t border-gray-700 z-50">
            <div className="flex justify-around items-center py-4">
                {/* Home Button */}
                <button
                    onClick={() => router.push('/')}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineHome className="text-2xl"/>
                </button>

                {/* Services Button */}
                <button
                    onClick={() => router.push('/services')}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineAppstore className="text-2xl"/>
                </button>
                <button
                    onClick={() => router.push('/services')}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineAppstore className="text-2xl"/>
                </button>
                {/* Profile Button */}
                <button
                    onClick={() => router.push('/profile')}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineUser className="text-2xl"/>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;