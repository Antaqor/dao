// src/app/profile/page.tsx

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/auth/login");
    }, [session, status, router]);

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

    const user = {
        username: session.user.username || "Unknown User",
        email: session.user.email || "No email available",
        profilePicture: session.user.profilePicture
            ? `${backendUrl}/api/auth/profile-picture/${session.user.id}`
            : "/img/default-user.png",
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pb-20">
            {/* Header Section */}
            <div className="w-full h-56 bg-blue-600 relative">
                <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                        <Image src={user.profilePicture} alt="Profile Picture" width={80} height={80} className="object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">{user.username}</h1>
                        <p className="text-sm text-white/80">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white shadow mt-12 mx-4 p-4 rounded-lg flex justify-around text-center">
                <div>
                    <p className="text-lg font-semibold">120.6K</p>
                    <p className="text-sm text-gray-600">Likes</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">6</p>
                    <p className="text-sm text-gray-600">Following</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">239.5K</p>
                    <p className="text-sm text-gray-600">Followers</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-50 flex justify-around text-center text-sm font-semibold text-gray-600 py-2 mt-4">
                <button className="hover:text-blue-500">Works</button>
                <button className="hover:text-blue-500">Products</button>
                <button className="hover:text-blue-500">Events</button>
            </div>

            {/* Placeholder Content */}
            <div className="p-4 flex-grow flex flex-col items-center justify-center text-gray-500">
                <p>User-specific content will appear here.</p>
            </div>

            {/* Logout Button */}
            <div className="bg-white p-4 shadow-md">
                <button
                    onClick={() => signOut()}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-150"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;