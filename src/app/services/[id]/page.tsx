"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

// ====== Types =======
interface StylistTimeBlock {
    stylist: {
        _id: string;
        name: string;
    } | null;
    timeBlocks: {
        label: string;     // e.g. "Morning", "Afternoon", "Evening"
        times: string[];   // e.g. ["09:00 AM", "09:15 AM", ...]
    }[];
}

interface ServiceData {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

interface ServiceParams {
    id?: string;
}

export default function ServiceBookingPage() {
    const params = useParams() as ServiceParams;
    const { data: session } = useSession();

    // ====== State =======
    const [service, setService] = useState<ServiceData | null>(null);
    const [stylistBlocks, setStylistBlocks] = useState<StylistTimeBlock[]>([]);

    // Default date to "today"
    const todayStr = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);

    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedStylistId, setSelectedStylistId] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState("");

    // ====== 1) Fetch the service details =======
    useEffect(() => {
        if (!params.id) return;
        (async () => {
            try {
                const sRes = await axios.get<ServiceData>(
                    `http://152.42.243.146:5001/api/services/${params.id}`
                );
                setService(sRes.data);
            } catch (error) {
                console.error("Failed to fetch service:", error);
            }
        })();
    }, [params.id]);

    // ====== 2) Fetch availability for the chosen date =======
    useEffect(() => {
        if (!params.id || !selectedDate) return;
        (async () => {
            try {
                const avRes = await axios.get<StylistTimeBlock[]>(
                    `http://152.42.243.146:5001/api/services/${params.id}/availability`,
                    { params: { date: selectedDate } }
                );
                setStylistBlocks(avRes.data);
            } catch (error) {
                console.error("Failed to load availability:", error);
                setMessage("Failed to load availability.");
            }
        })();
    }, [params.id, selectedDate]);

    // ====== 3) Opening/Confirming Booking =======
    const openBookingModal = (styId: string | null, time: string) => {
        if (!session?.user) {
            setMessage("Please log in to book an appointment.");
            return;
        }
        setSelectedStylistId(styId);
        setSelectedTime(time);
        setShowModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!session?.user || !params.id || !selectedDate || !selectedTime) {
            setMessage("Please select a date/time first.");
            return;
        }
        try {
            const res = await axios.post(
                "http://152.42.243.146:5001/api/appointments",
                {
                    serviceId: params.id,
                    stylistId: selectedStylistId,
                    date: selectedDate,
                    startTime: selectedTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${
                            (session.user as { accessToken: string }).accessToken
                        }`,
                    },
                }
            );
            if (res.status === 201) {
                setMessage("Appointment booked successfully!");
            } else {
                setMessage("Failed to book appointment.");
            }
            setShowModal(false);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Error booking appointment.");
            }
        }
    };

    if (!service) return <p className="p-4">Loading service...</p>;

    // ====== 4) Render =======
    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* Service Info */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold">{service.name}</h1>
                <p className="text-gray-600">
                    ${service.price} — {service.durationMinutes} min
                </p>
            </div>

            {/* Messages */}
            {message && <p className="text-red-600 mb-2">{message}</p>}

            {/* Date Picker */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Select Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setMessage("");
                    }}
                    className="border p-2 rounded w-full"
                    min={todayStr}
                />
            </div>

            {/* Availability */}
            <div>
                {stylistBlocks.length === 0 ? (
                    <p className="text-gray-500">
                        No availability found for {selectedDate}.
                    </p>
                ) : (
                    stylistBlocks.map((block, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded p-4 mb-4 bg-gray-50"
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {block.stylist
                                    ? `Stylist: ${block.stylist.name}`
                                    : "Any Stylist (No Specific Stylist)"}
                            </h3>

                            {block.timeBlocks.map((tb, tbIdx) => (
                                <div key={tbIdx} className="mb-4">
                                    {/* Section Label (e.g. Morning / Afternoon / Evening) */}
                                    <p className="font-semibold text-blue-600 mb-2">{tb.label}</p>
                                    {/* Times */}
                                    <div className="flex flex-wrap gap-2">
                                        {tb.times.map((time, i) => {
                                            // Here you can check if a time is "booked" or not.
                                            // For now, let's assume all are free and clickable.
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => openBookingModal(block.stylist?._id || null, time)}
                                                    className="px-3 py-1 border border-gray-300 rounded hover:bg-blue-50 transition-colors"
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-full max-w-md rounded relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600"
                            onClick={() => setShowModal(false)}
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
                        <p className="mb-2">
                            <strong>Date:</strong> {selectedDate}
                            <br />
                            <strong>Time:</strong> {selectedTime}
                            <br />
                            <strong>Stylist:</strong>{" "}
                            {selectedStylistId ? "Selected Stylist" : "Any Stylist"}
                        </p>
                        <button
                            onClick={handleConfirmBooking}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}