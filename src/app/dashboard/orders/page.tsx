// app/dashboard/orders/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Components
import Sidebar from "@/app/components/Sidebar";
import MinimalTabs from "@/app/components/MinimalTabs";

interface AppointmentData {
    _id: string;
    date: string;
    startTime: string;
    service?: { name: string };
    user?: { username: string };
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if (session?.user?.accessToken && session.user.role === "owner") {
                    const token = session.user.accessToken;
                    const aRes = await axios.get<AppointmentData[]>(
                        "http://localhost:5001/api/appointments",
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setAppointments(aRes.data);
                }
            } catch (err) {
                console.error("Error loading appointments:", err);
                setError("Failed to load booking orders.");
            }
        };
        fetchAppointments();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user || session.user.role !== "owner") {
        return <p>You must be an owner to view this page.</p>;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar for Desktop */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {/* Minimal tabs for Mobile */}
                <MinimalTabs />

                <h1 className="text-2xl font-bold mb-4">Orders (Appointments)</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}

                {appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments found.</p>
                ) : (
                    <ul className="space-y-2">
                        {appointments.map((appt) => (
                            <li key={appt._id} className="border p-3 rounded bg-white">
                                <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
                                <br />
                                <strong>Time:</strong> {appt.startTime}
                                <br />
                                <strong>Service:</strong> {appt.service?.name || "—"}
                                <br />
                                <strong>User:</strong> {appt.user?.username || "—"}
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}