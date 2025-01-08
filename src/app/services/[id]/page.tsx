"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import MonthCalendar, { MonthData, DayStatus } from "@/app/components/MonthCalendar";

/** Extend the NextAuth session user type to have an optional accessToken. */
interface SessionUser {
    id?: string;
    name?: string;
    email?: string;
    accessToken?: string;
}

interface ServiceData {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

/** Convert "HH:mm" => e.g. "2:15 PM" */
function format24to12(time24: string): string {
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${String(minute).padStart(2, "0")} ${ampm}`;
}

export default function ServiceDetailPage() {
    const { id } = useParams() as { id?: string };
    const [service, setService] = useState<ServiceData | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Show or hide the booking popup
    const [showBookingPopup, setShowBookingPopup] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("Service ID is missing.");
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const res = await axios.get<ServiceData>(
                    `http://152.42.243.146/api/services/${id}`
                );
                setService(res.data);
            } catch (err) {
                console.error("Failed to load service:", err);
                setError("Үйлчилгээ ачаалж чадсангүй.");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <p className="p-4">Үйлчилгээ ачаалж байна...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;
    if (!service) return <p className="p-4 text-gray-500">Үйлчилгээ олдсонгүй.</p>;

    function handleOpenPopup() {
        setShowBookingPopup(true);
    }
    function handleClosePopup() {
        setShowBookingPopup(false);
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
            <p className="text-gray-700 mb-2">
                Үнэ: <strong>{service.price.toLocaleString()} ₮</strong>
            </p>
            <p className="text-gray-700 mb-4">
                Үргэлжлэх хугацаа: <strong>{service.durationMinutes} мин</strong>
            </p>

            <button
                onClick={handleOpenPopup}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Захиалга хийх
            </button>

            {showBookingPopup && (
                <OrderPopup
                    serviceId={service._id}
                    servicePrice={service.price}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
}

/** Popup for booking */
function OrderPopup({
                        serviceId,
                        servicePrice,
                        onClose,
                    }: {
    serviceId: string;
    servicePrice: number;
    onClose: () => void;
}) {
    const { data: session } = useSession();
    const [monthData, setMonthData] = useState<MonthData | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const [times, setTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookingDone, setBookingDone] = useState(false);

    useEffect(() => {
        // Minimal sample data for January 2025
        const januaryDays: DayStatus[] = [
            { day: 6, status: "goingFast" },
            { day: 10, status: "fullyBooked" },
        ];
        const january2025: MonthData = {
            year: 2025,
            month: 0,
            days: januaryDays,
        };
        setMonthData(january2025);
    }, []);

    // Fetch times from server
    useEffect(() => {
        if (!selectedDay) {
            setTimes([]);
            return;
        }
        setLoading(true);
        setMsg("");

        const dateStr = `2025-01-${String(selectedDay).padStart(2, "0")}`;
        axios
            .get<{ times: string[] }[]>(`http://152.42.243.146/api/services/${serviceId}/availability`, {
                params: { date: dateStr },
            })
            .then((res) => {
                const data = res.data;
                const allTimes = data.flatMap((b) => b.times || []);
                const uniqueTimes = Array.from(new Set(allTimes)).sort();
                setTimes(uniqueTimes);
            })
            .catch((err) => {
                console.error("Error fetching times:", err);
                setMsg("Цагийн мэдээлэл ачаалж чадсангүй.");
            })
            .finally(() => setLoading(false));
    }, [serviceId, selectedDay]);

    async function handleBookTime() {
        if (!session?.user) {
            setMsg("Та эхлээд нэвтэрч орно уу.");
            return;
        }
        if (!selectedDay || !selectedTime) {
            setMsg("Өдөр болон цаг сонгоно уу.");
            return;
        }
        try {
            const token = (session.user as SessionUser)?.accessToken;
            if (!token) {
                setMsg("Token олдсонгүй. Дахин нэвтэрнэ үү.");
                return;
            }
            const dateStr = `2025-01-${String(selectedDay).padStart(2, "0")}`;
            const res = await axios.post(
                "http://152.42.243.146/api/appointments",
                {
                    serviceId,
                    date: dateStr,
                    startTime: selectedTime,
                    status: "paid",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.status === 201) {
                setBookingDone(true);
                setMsg("Захиалга амжилттай боллоо!");
            } else {
                setMsg("Захиалга үүсгэхэд алдаа гарлаа.");
            }
        } catch (err) {
            console.error("Booking error:", err);
            setMsg("Серверийн алдаа эсвэл та нэвтрэх шаардлагатай.");
        }
    }

    function handleClose() {
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-6 rounded w-full max-w-md relative">
                <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600">
                    ✕
                </button>
                {!bookingDone ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">Цаг Захиалга</h2>
                        <p className="text-sm text-gray-700 mb-3">
                            <strong>Төлбөр:</strong> {servicePrice.toLocaleString()} ₮
                        </p>

                        {monthData && (
                            <MonthCalendar
                                monthData={monthData}
                                selectedDay={selectedDay}
                                onSelectDay={setSelectedDay}
                            />
                        )}
                        {loading && <p className="mt-4 text-sm">Ачаалж байна...</p>}
                        {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}

                        {times.length > 0 && !loading && (
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold mb-2">Цаг сонгох:</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {times.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`px-3 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100 ${
                                                selectedTime === t ? "bg-blue-600 text-white" : ""
                                            }`}
                                        >
                                            {format24to12(t)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Болих
                            </button>
                            <button
                                onClick={handleBookTime}
                                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Төлбөр (Жишээ) &amp; Захиалах
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-green-600 mb-4">
                            Амжилттай Захиалга!
                        </h2>
                        <p className="text-sm text-gray-700 mb-4">
                            Баярлалаа. Таны цагийг амжилттай бүртгэлээ.
                        </p>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Хаах
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
