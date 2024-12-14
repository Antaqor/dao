// src/app/profile/[username]/page.tsx

import Image from "next/image";

interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    hasProfilePicture: boolean;
}

export default async function ProfileByUsernamePage({ params }: { params: Record<string, string> }) {
    const username = params.username;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

    const res = await fetch(`${backendUrl}/api/users/by-username/${username}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <p className="text-red-500 text-lg">User not found.</p>
                </div>
            );
        } else {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <p className="text-red-500 text-lg">Error fetching user: {res.status}</p>
                </div>
            );
        }
    }

    const user: UserProfile = await res.json();

    const profilePicture = user.hasProfilePicture
        ? `${backendUrl}/api/auth/profile-picture/${user.id}`
        : "/img/default-user.png";

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pb-20">
            {/* Header with solid blue background */}
            <div className="w-full h-56 bg-blue-600 relative">
                <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                        <Image src={profilePicture} alt="Profile Picture" width={80} height={80} className="object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">{user.username}</h1>
                        <p className="text-sm text-white/80">{user.email}</p>
                        {user.role === 'stylist' && (
                            <p className="text-sm text-blue-200">Stylist</p>
                        )}
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
                <p>User&apos;s content or posts could be displayed here.</p>
            </div>
        </div>
    );
}