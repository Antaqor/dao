// app/dashboard/services/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import MinimalTabs from "@/app/components/MinimalTabs";

interface ServiceData {
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
}

export default function ServicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [services, setServices] = useState<ServiceData[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                if (session?.user?.accessToken && session.user.role === "owner") {
                    const token = session.user.accessToken;
                    // fetch owner's salon to get salon ID
                    const salonRes = await axios.get("http://152.42.243.146:5001/api/salons/my-salon", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const salonId = salonRes.data._id;

                    // fetch all services for that salon
                    const servRes = await axios.get<ServiceData[]>(
                        `http://152.42.243.146:5001/api/services/salon/${salonId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setServices(servRes.data);
                }
            } catch (err) {
                console.error("Error loading services:", err);
                setError("Failed to load services.");
            }
        };
        fetchServices();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user || session.user.role !== "owner") {
        return <p>You must be an owner to view this page.</p>;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <MinimalTabs />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <a
                        href="/dashboard/create-service"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add Service
                    </a>
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {services.length === 0 ? (
                    <p className="text-gray-500">No services found. Try adding one!</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((svc) => (
                            <li
                                key={svc._id}
                                className="bg-white border border-gray-200 p-4 rounded"
                            >
                                <p className="text-lg font-semibold">{svc.name}</p>
                                <p className="text-sm text-gray-500">
                                    {svc.durationMinutes} min — ${svc.price}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}