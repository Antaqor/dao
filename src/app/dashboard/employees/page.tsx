"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Sidebar from "@/app/components/Sidebar";
import MinimalTabs from "@/app/components/MinimalTabs";

interface StylistData {
    _id: string;
    name: string;
}

export default function EmployeesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stylists, setStylists] = useState<StylistData[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchStylists = async () => {
            try {
                if (session?.user?.accessToken && session.user.role === "owner") {
                    const token = session.user.accessToken;
                    const salonRes = await axios.get("http://152.42.243.146/api/salons/my-salon", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const salonId = salonRes.data._id;

                    const styRes = await axios.get<StylistData[]>(
                        `http://152.42.243.146/api/stylists/salon/${salonId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setStylists(styRes.data);
                }
            } catch (err) {
                console.error("Error loading stylists:", err);
                setError("Failed to load employees.");
            }
        };
        fetchStylists();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user || session.user.role !== "owner") {
        return <p>You must be an owner to view this page.</p>;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 p-6 overflow-y-auto">
                {/* Mobile Tabs */}
                <MinimalTabs />

                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Employees (Stylists)</h1>
                    <a
                        href="/dashboard/create-stylist"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add Stylist
                    </a>
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {stylists.length === 0 ? (
                    <p className="text-gray-500">No employees found. Try adding one!</p>
                ) : (
                    <ul className="space-y-2">
                        {stylists.map((st) => (
                            <li key={st._id} className="border p-3 rounded bg-white">
                                {st.name}
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}