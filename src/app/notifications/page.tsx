// src/app/notifications/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Notification {
    _id: string;
    message: string;
    createdAt: string;
    read: boolean;
}

interface ApiError {
    error?: string;
    [key: string]: unknown;
}

const NotificationsPage: React.FC = () => {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001';

    const fetchNotifications = useCallback(async () => {
        if (!session?.user?.accessToken) return;
        try {
            const res = await fetch(`${backendUrl}/api/notifications`, {
                headers: { Authorization: `Bearer ${session.user.accessToken}` },
            });
            if (!res.ok) throw new Error(`Error fetching notifications: ${res.status}`);
            const data: Notification[] | ApiError = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data);
            } else {
                setError(data.error || 'Failed to load notifications.');
            }
        } catch (err) {
            console.error("Failed to load notifications:", err);
            setError("Failed to load notifications.");
        }
    }, [session?.user?.accessToken, backendUrl]);

    const markAllRead = async () => {
        if (!session?.user?.accessToken) return;
        try {
            const res = await fetch(`${backendUrl}/api/notifications/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${session.user.accessToken}` },
            });
            if (!res.ok) throw new Error(`Error marking notifications as read: ${res.status}`);
            setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Failed to mark notifications as read:", err);
            setError("Failed to mark notifications as read.");
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchNotifications();
        }
    }, [status, fetchNotifications]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <h1 className="text-white">Please sign in to view notifications.</h1>
            </div>
        );
    }

    const isStylist = (session?.user as {role?: string})?.role === 'stylist';

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <h1 className="text-2xl mb-4">Notifications</h1>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <button onClick={markAllRead} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md mb-4">
                Mark All as Read
            </button>

            {isStylist && (
                <Link href="/stylist/pending">
                    <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md mb-4 block">
                        Orders
                    </button>
                </Link>
            )}

            {notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div key={notif._id} className={`bg-gray-800 p-4 rounded-md ${notif.read ? 'opacity-75' : ''}`}>
                            <p className="text-white font-semibold">{notif.message}</p>
                            <p className="text-gray-400 text-sm">{new Date(notif.createdAt).toLocaleString()}</p>
                            {!notif.read && <span className="text-green-500 text-sm">New</span>}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No notifications found.</p>
            )}
        </div>
    );
};

export default NotificationsPage;