// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import DashboardTabs from "../components/MinimalTabs";

interface SalonData {
    _id: string;
    name: string;
    location: string;
}

interface ServiceData {
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [salon, setSalon] = useState<SalonData | null>(null);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchSalonAndServices = async () => {
            try {
                if (session?.user?.accessToken && session.user.role === "owner") {
                    const token = session.user.accessToken;

                    // fetch the owner's salon
                    const salonRes = await axios.get("http://152.42.243.146:5001/api/salons/my-salon", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setSalon(salonRes.data);

                    // fetch that salon's services
                    const servRes = await axios.get<ServiceData[]>(
                        `http://152.42.243.146:5001/api/services/salon/${salonRes.data._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setServices(servRes.data);
                }
            } catch (err) {
                console.error("Error loading dashboard:", err);
                setError("Failed to load dashboard data.");
            }
        };
        fetchSalonAndServices();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user || session.user.role !== "owner") {
        return <p>You must be an owner to view this page.</p>;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">

            <Sidebar />
            {/* Main content area */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <DashboardTabs />
                <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}

                {salon ? (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">{salon.name}</h2>
                        <p className="text-gray-600">{salon.location}</p>
                    </div>
                ) : (
                    <p className="mb-6 text-red-500">
                        No salon found. You may want to{" "}
                        <a
                            href="/dashboard/create-salon"
                            className="text-blue-600 underline"
                        >
                            create or update your salon
                        </a>
                        .
                    </p>
                )}

                {/* Quick List of Services */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold">Services</h3>
                    {services.length === 0 ? (
                        <p className="text-gray-500 mt-2">No services found.</p>
                    ) : (
                        <ul className="mt-2 space-y-2">
                            {services.map((svc) => (
                                <li key={svc._id} className="border p-3 rounded">
                                    {svc.name} — {svc.durationMinutes} min — ${svc.price}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}