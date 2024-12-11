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
        console.log("Session Data:", session); // Inspect session object
        if (status === "loading") return; // Do nothing while loading
        if (!session) router.push("/auth/login"); // Redirect if not authenticated
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null; // Or a loading spinner
    }

    // Construct the profile picture URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

    const user = {
        id: session.user.id,
        username: session.user.username || "Unknown User",
        email: session.user.email || "No email available",
        profilePicture: session.user.profilePicture
            ? `${backendUrl}/api/auth/profile-picture/${session.user.id}`
            : "/img/default-user.png", // Use the profilePicture field or default
        banner: "/img/banner.jpg",
    };

    const postImages = [
        "/img/post1.jpg",
        "/img/post2.jpg",
        "/img/post3.jpg",
        "/img/post4.jpg",
        "/img/post5.jpg",
        "/img/post6.jpg",
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pb-20">
            {/* Header */}
            <div className="relative">
                {/* Banner Image */}
                <div className="relative w-full h-56">
                    <Image
                        src={user.banner}
                        alt="Banner Image"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Logo and Username */}
                <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                        <Image
                            src={user.profilePicture}
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-black">{user.username}</h1>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white shadow mt-12 mx-4 p-4 rounded-lg flex justify-around text-center">
                <div>
                    <p className="text-lg font-semibold">120.6К</p>
                    <p className="text-sm text-gray-600">Таалагдсан</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">6</p>
                    <p className="text-sm text-gray-600">Дагаж байгаа</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">239.5К</p>
                    <p className="text-sm text-gray-600">Дагагчид</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 flex justify-around text-center text-sm font-semibold text-gray-600 py-2 mt-4">
                <button className="hover:text-blue-500">Бүтээлүүд</button>
                <button className="hover:text-blue-500">Бараа бүтээгдэхүүн</button>
                <button className="hover:text-blue-500">Үйл явдал</button>
            </div>

            {/* Posts Section */}
            <div className="grid grid-cols-2 gap-4 p-4 flex-grow">
                {postImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm"
                    >
                        <Image
                            src={image}
                            alt={`Post Image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-sm">
                            <p>393 Таалагдсан</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout Button */}
            <div className="bg-white p-4 shadow-md">
                <button
                    onClick={() => signOut()}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-150"
                >
                    Гарах
                </button>
            </div>
        </div>
    );

};

export default ProfilePage;