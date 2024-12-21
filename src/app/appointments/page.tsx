"use client";
import React, { useState } from "react";
import axios from "axios";

export default function AppointmentsPage() {
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [date, setDate] = useState("");
    const [startHour, setStartHour] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Environment variable for the backend
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

    const handleBookAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await axios.post(`${backendURL}/api/appointments`, {
                serviceId,
                stylistId,
                date,
                startHour,
            }, {
                // If the route is protected, you might need a token in headers
                // headers: { Authorization: `Bearer <token>` },
            });

            if (response.status === 201) {
                setMessage("Appointment booked successfully!");
            } else {
                setMessage("Could not book appointment. Please try again.");
            }
        } catch (error: any) {
            console.error("Error booking appointment:", error);
            setMessage(error.response?.data?.error || "An unexpected error occurred.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
            <form onSubmit={handleBookAppointment} className="space-y-4 max-w-md">
                <div>
                    <label className="block mb-1 font-semibold">Service ID</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Stylist ID</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={stylistId}
                        onChange={(e) => setStylistId(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Date</label>
                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Start Hour</label>
                    <input
                        type="number"
                        className="w-full border rounded p-2"
                        placeholder="e.g., 9 for 9AM"
                        value={startHour || ""}
                        onChange={(e) => setStartHour(parseInt(e.target.value))}
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Book
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center font-medium">{message}</p>
            )}
        </div>
    );
}