"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    HomeIcon,
    PlusCircleIcon,
    BellIcon,
    UserCircleIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';

const BottomNav: React.FC = () => {
    const { data: session } = useSession();
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001';

    const fetchUnreadCount = async () => {
        if (!session?.user?.accessToken) return;
        try {
            const res = await fetch(`${backendUrl}/api/notifications`, {
                headers: { Authorization: `Bearer ${session.user.accessToken}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            const unread = data.filter((notif: any) => !notif.read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error('Failed to fetch notifications count:', err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, [session]);

    return (
        <nav className="fixed bottom-0 w-full bg-[#121212] border-t border-gray-700 z-50">
            <div className="flex justify-between items-center px-4 py-3">
                <button
                    className="flex items-center justify-center text-gray-400 hover:text-white transition"
                    onClick={() => router.push('/')}
                >
                    <HomeIcon className="h-6 w-6" />
                </button>

                <button className="flex items-center justify-center text-gray-400 hover:text-white transition">
                    <Squares2X2Icon className="h-6 w-6" />
                </button>

                <div className="relative">
                    <button className="flex items-center justify-center bg-gray-700 text-white rounded-full w-12 h-12 shadow-lg hover:bg-gray-600 transition duration-300 focus:ring-2 focus:ring-gray-600">
                        <PlusCircleIcon className="h-8 w-8" />
                    </button>
                </div>

                <button
                    className="flex items-center justify-center text-gray-400 hover:text-white transition relative"
                    onClick={() => router.push('/notifications')}
                >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                            {unreadCount}
                        </span>
                    )}
                </button>

                <button
                    className="flex items-center justify-center text-gray-400 hover:text-white transition"
                    onClick={() => router.push('/profile')}
                >
                    <UserCircleIcon className="h-6 w-6" />
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;