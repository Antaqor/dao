import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AiOutlineHome, AiOutlineUser, AiOutlineAppstore } from 'react-icons/ai';

const BottomNav: React.FC = () => {
    const router = useRouter();
    const { status } = useSession();

    const handleProfileNavigation = () => {
        if (status === 'authenticated') {
            router.push('/profile');
        } else {
            router.push('/login'); // Redirect to plain /login without callbackUrl
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black shadow-md border-t border-gray-700 z-50">
            <div className="flex justify-around items-center py-4">
                {/* Home Button */}
                <button
                    onClick={() => router.push('/')}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineHome className="text-2xl" />
                    <span className="text-sm mt-1">Home</span>
                </button>

                {/* Services Button */}
                <button
                    onClick={() => router.push('/services')}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineAppstore className="text-2xl" />
                    <span className="text-sm mt-1">Services</span>
                </button>

                {/* Profile Button */}
                <button
                    onClick={handleProfileNavigation}
                    className="flex flex-col items-center text-gray-400 hover:text-white transition-all duration-200"
                >
                    <AiOutlineUser className="text-2xl" />
                    <span className="text-sm mt-1">Profile</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;