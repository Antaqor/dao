"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // Redirect to a clean /login page without callbackUrl
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Loading...</p>
            </div>
        );
    }

    if (!session) return null; // Avoid rendering until session is available

    // Mock user data (replace with session data if available)
    const user = {
        name: session?.user?.name || "Anonymous",
        phone: "94641031", // Replace with actual data
        email: session?.user?.email || "И-Мэйл холбогдоогүй",
        qrCode: "/img/qrcode.png",
        iban: "MN03 0050 0991 0696 8846",
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-blue-500 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        className="text-white text-lg font-bold"
                        onClick={() => router.back()}
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-bold">Өдрийн мэнд</h1>
                </div>
                <button
                    onClick={() => router.push("/settings")}
                    className="text-white text-lg"
                >
                    ⚙️
                </button>
            </div>

            {/* User Info */}
            <div className="bg-blue-500 text-white px-6 py-6 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                        src="/img/avatar.png"
                        alt="User Avatar"
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-lg font-bold">{user.name}</h2>
                    <p className="text-sm">{user.phone}</p>
                    <p className="text-sm">{user.email}</p>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="px-6 py-4 bg-white shadow rounded-lg mt-4 mx-4">
                <h3 className="text-sm font-semibold text-gray-500">Монпэй дансны дугаар</h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold">{user.phone}</span>
                    <div className="w-16 h-16">
                        <Image
                            src={user.qrCode}
                            alt="QR Code"
                            width={64}
                            height={64}
                            className="object-contain"
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    IBAN дансны дугаар: {user.iban}
                </p>
            </div>

            {/* Logout Button */}
            <div className="mt-6 px-4">
                <button
                    onClick={() => signOut()}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-150"
                >
                    Гарах
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;