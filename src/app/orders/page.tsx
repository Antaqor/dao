// File: /app/client-appointments/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Та өөрийн AuthContext-д тааруулна уу

/** Үйлчилгээний үндсэн мэдээлэл */
interface ServiceData {
    name: string;
}

/** Хэрэглэгчийн үндсэн мэдээлэл (стилист гэх мэт) */
interface UserData {
    username: string;
    phoneNumber?: string;
}

/** Цаг захиалгын бүтэц */
interface AppointmentData {
    _id: string;
    date: string;       // e.g. "2025-01-15T00:00:00.000Z"
    startTime: string;  // e.g. "14:30"
    createdAt?: string;
    service?: ServiceData;
    stylist?: UserData;
    classification?: string; // "past", "soon", or "upcoming"
}

/** Цаг захиалгуудыг ачаалж байх үед үзүүлэх skeleton */
function AppointmentsSkeleton() {
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
    const { user, loggedIn } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 1) Хэрэв нэвтрээгүй эсвэл user.role !== "user" бол /login руу чиглүүлнэ
    useEffect(() => {
        if (!loggedIn || !user) {
            router.push("/login");
        } else if (user.role !== "user") {
            router.push("/login");
        }
    }, [loggedIn, user, router]);

    // 2) Хэрэглэгчийн цаг захиалгыг серверээс татах
    useEffect(() => {
        async function fetchUserAppointments() {
            try {
                setLoading(true);
                setError("");

                // AuthContext дотор хадгалсан JWT token
                const token = user?.accessToken;
                if (!token) return;

                // Backend: Хэрэв role="user" бол тухайн хэрэглэгчийн цаг захиалгыг буцаана
                const res = await axios.get<AppointmentData[]>(
                    "http://68.183.191.149/api/appointments",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // Огноо болон цагийг өсөхөөр эрэмбэлнэ
                const now = Date.now();
                const sorted = [...res.data].sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    // Хэрэв огноо адил бол startTime-оор жишин эрэмбэлнэ
                    return dateA === dateB
                        ? a.startTime.localeCompare(b.startTime)
                        : dateA - dateB;
                });

                // Тухайн цагийг "past", "soon", "upcoming" гэж ангилна
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
                setError("Таны цаг захиалгыг уншиж чадсангүй. Дахин оролдоно уу.");
            } finally {
                setLoading(false);
            }
        }

        if (loggedIn && user?.role === "user") {
            void fetchUserAppointments();
        }
    }, [loggedIn, user]);

    // 3) Хэрэв нэвтрээгүй бол redirect хийгдсэн байдаг тул юу ч буцаахгүй
    if (!loggedIn || !user || user.role !== "user") {
        return null;
    }

    // 4) Хуудасны UI-г буулгах
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <div className="w-full max-w-3xl rounded-lg p-8 ">
                <h1 className="text-m font-semibold mb-8 text-center tracking-wide">
                    Миний цаг захиалгууд
                </h1>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <AppointmentsSkeleton />
                ) : appointments.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Танд одоогоор цаг захиалга байхгүй байна.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {appointments.map((appt) => {
                            const dateObj = new Date(appt.date);
                            // YYYY-MM-DD форматаар харуулахын тулд en-CA locale ашигласан
                            const dateStr = dateObj.toLocaleDateString("en-CA");

                            return (
                                <li
                                    key={appt._id}
                                    className="border border-gray-200 p-4 rounded hover:shadow transition-shadow"
                                >
                                    <div className="flex flex-col gap-1 text-sm text-gray-700">
                                        <div>
                                            <span className="font-semibold">
                                                Үйлчилгээ:
                                            </span>{" "}
                                            {appt.service?.name || "Байхгүй"}
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                Огноо:
                                            </span>{" "}
                                            {dateStr}
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                Цаг:
                                            </span>{" "}
                                            {appt.startTime}
                                        </div>
                                        {appt.stylist && (
                                            <div>
                                                <span className="font-semibold">
                                                    Мастер:
                                                </span>{" "}
                                                {appt.stylist.username ||
                                                    "Одоогоор тодорхойгүй"}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 italic">
                                            Төлөв: {appt.classification}
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
