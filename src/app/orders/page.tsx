"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // ← your custom hook

/** Minimal service info for display */
interface ServiceData {
    name: string;
}

/** Minimal user info if needed */
interface UserData {
    username: string;
    phoneNumber?: string;
}

/** Appointment structure for user */
interface AppointmentData {
    _id: string;
    date: string;       // e.g. "2025-01-15T00:00:00.000Z"
    startTime: string;  // e.g. "14:30"
    createdAt?: string;
    service?: ServiceData;
    stylist?: UserData;
    classification?: string;
}

/** Simple skeleton while loading */
function OrdersSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-16 w-full bg-gray-200 rounded" />
            <div className="h-16 w-full bg-gray-200 rounded" />
        </div>
    );
}

export default function ClientAppointmentsPage() {
    const router = useRouter();
    const { user, loggedIn } = useAuth(); // from AuthContext
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 1) If not logged in or user.role != "user", redirect => /login
    useEffect(() => {
        if (!loggedIn || !user) {
            router.push("/login");
        } else if (user.role !== "user") {
            router.push("/login");
        }
    }, [loggedIn, user, router]);

    // 2) Fetch user’s appointments
    useEffect(() => {
        async function fetchUserAppointments() {
            try {
                setLoading(true);
                setError("");

                // Suppose your AuthContext stored the JWT in user.accessToken
                const token = user?.accessToken;
                if (!token) return;

                // The backend logic: if role="user", returns only that user’s appointments
                const res = await axios.get<AppointmentData[]>(
                    "http://68.183.191.149/api/appointments",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // Sort them by date/time ascending
                const now = Date.now();
                const sorted = [...res.data].sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    // If same date, compare startTime
                    return dateA === dateB
                        ? a.startTime.localeCompare(b.startTime)
                        : dateA - dateB;
                });

                // Classify each appointment as "past", "soon", or "upcoming"
                const MS_IN_24H = 24 * 60 * 60 * 1000;
                const classified = sorted.map((appt) => {
                    const apptDate = new Date(appt.date);
                    const [hh, mm] = appt.startTime.split(":").map(Number);
                    apptDate.setHours(hh, mm, 0, 0);

                    const diff = apptDate.getTime() - now;
                    let classification = "upcoming";
                    if (diff < 0) classification = "past";
                    else if (diff < MS_IN_24H) classification = "soon";

                    return { ...appt, classification };
                });

                setAppointments(classified);
            } catch (err) {
                console.error("Error fetching user appointments:", err);
                setError("Failed to load your appointments. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        if (loggedIn && user?.role === "user") {
            void fetchUserAppointments();
        }
    }, [loggedIn, user]);

    // 3) If not logged in => we redirect => just render nothing
    if (!loggedIn || !user || user.role !== "user") {
        return null;
    }

    // 4) Render
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded p-4 shadow-sm">
                <h1 className="text-xl font-bold mb-4">My Appointments</h1>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                {loading ? (
                    <OrdersSkeleton />
                ) : appointments.length === 0 ? (
                    <p className="text-sm text-gray-500">You have no appointments yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {appointments.map((appt) => {
                            const dateObj = new Date(appt.date);
                            const dateStr = dateObj.toLocaleDateString("en-CA");
                            return (
                                <li
                                    key={appt._id}
                                    className="border border-gray-200 p-3 rounded hover:shadow transition-shadow"
                                >
                                    <div className="flex flex-col gap-1 text-sm text-gray-700">
                                        <div>
                                            <strong>Service:</strong> {appt.service?.name || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Date:</strong> {dateStr}
                                        </div>
                                        <div>
                                            <strong>Time:</strong> {appt.startTime}
                                        </div>
                                        {appt.stylist && (
                                            <div>
                                                <strong>Stylist:</strong>{" "}
                                                {appt.stylist.username || "No stylist assigned"}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 italic">
                                            Classification: {appt.classification}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
