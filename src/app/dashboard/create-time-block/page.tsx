"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Removed AxiosError
import { useSession } from "next-auth/react";

interface Service {
    _id: string;
    name: string;
}

interface Stylist {
    _id: string;
    name: string;
}

interface SalonResponse {
    _id: string;
    name: string;
}

export default function CreateTimeBlockPage() {
    const { data: session } = useSession();

    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [label, setLabel] = useState("Morning");
    const [date, setDate] = useState<string>(() => {
        const now = new Date();
        return now.toISOString().split("T")[0];
    });
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("12:00");
    const [interval, setInterval] = useState(15);
    const [generatedTimes, setGeneratedTimes] = useState<string[]>([]);

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch services/stylists when page loads
    useEffect(() => {
        if (!session?.user?.accessToken) return;
        const fetchOwnerData = async () => {
            try {
                const token = session.user.accessToken;
                // Salon
                const salonRes = await axios.get<SalonResponse>(
                    "http://152.42.243.146:5001/api/salons/my-salon",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const salonId = salonRes.data._id;

                // Services
                const servRes = await axios.get<Service[]>(
                    `http://152.42.243.146:5001/api/services/salon/${salonId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServices(servRes.data);

                // Stylists
                const styRes = await axios.get<Stylist[]>(
                    `http://152.42.243.146:5001/api/stylists/salon/${salonId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStylists(styRes.data);
            } catch (error) {
                console.error("Error loading owner data:", error);
                setMessage("Failed to load data.");
            }
        };
        fetchOwnerData();
    }, [session]);

    // Generate time slots from start to end
    const generateTimes = () => {
        setGeneratedTimes([]);
        setMessage("");

        if (!date) {
            setMessage("Please choose a date.");
            return;
        }

        const [startHrStr, startMinStr] = startTime.split(":");
        const [endHrStr, endMinStr] = endTime.split(":");
        const startHr = parseInt(startHrStr, 10);
        const startMin = parseInt(startMinStr, 10);
        const endHr = parseInt(endHrStr, 10);
        const endMin = parseInt(endMinStr, 10);

        if (endHr < startHr || (endHr === startHr && endMin <= startMin)) {
            setMessage("End time must be after start time.");
            return;
        }

        const current = new Date(`2022-01-01T${startTime}:00`); // Changed to const
        const finish = new Date(`2022-01-01T${endTime}:00`);
        const results: string[] = [];

        const formatTime = (d: Date) => {
            let hh = d.getHours();
            const mm = d.getMinutes();
            const suffix = hh >= 12 ? "PM" : "AM";
            if (hh === 0) hh = 12;
            else if (hh > 12) hh -= 12;
            const mmStr = mm.toString().padStart(2, "0");
            return `${hh}:${mmStr} ${suffix}`;
        };

        while (current <= finish) {
            results.push(formatTime(current));
            current.setMinutes(current.getMinutes() + interval);
        }
        setGeneratedTimes(results);
    };

    // Submit data
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }
        if (!serviceId) {
            setMessage("Please select a service.");
            return;
        }
        if (!date) {
            setMessage("Please select a date.");
            return;
        }
        if (generatedTimes.length === 0) {
            setMessage("Please generate times first.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = session.user.accessToken;
            const payload = {
                serviceId,
                stylistId: stylistId || null,
                date,              // "2024-12-25" etc.
                label,             // "Morning"/"Afternoon"/"Evening"/"Custom"
                times: generatedTimes,
            };

            const res = await axios.post(
                "http://152.42.243.146:5001/api/services/my-service/time-block",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 201) {
                setMessage("Time block added successfully!");
                // Reset
                setServiceId("");
                setStylistId("");
                setLabel("Morning");
                const now = new Date();
                setDate(now.toISOString().split("T")[0]);
                setStartTime("08:00");
                setEndTime("12:00");
                setInterval(15);
                setGeneratedTimes([]);
            } else {
                setMessage("Failed to add time block. Please try again.");
            }
        } catch (error) {
            console.error("Error adding time block:", error);
            setMessage("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add Time Blocks</h1>
            {message && <p className="text-red-600 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Service */}
                <div>
                    <label className="block font-semibold mb-1">Select Service</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        required
                    >
                        <option value="">-- choose service --</option>
                        {services.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stylist */}
                <div>
                    <label className="block font-semibold mb-1">Select Stylist (optional)</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={stylistId}
                        onChange={(e) => setStylistId(e.target.value)}
                    >
                        <option value="">No stylist (global)</option>
                        {stylists.map((st) => (
                            <option key={st._id} value={st._id}>
                                {st.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Block Label */}
                <div>
                    <label className="block font-semibold mb-1">Block Label</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="block font-semibold mb-1">Choose Date</label>
                    <input
                        type="date"
                        className="border p-2 w-full rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                {/* Start/End Time */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">Start Time</label>
                        <input
                            type="time"
                            className="border p-2 w-full rounded"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">End Time</label>
                        <input
                            type="time"
                            className="border p-2 w-full rounded"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Interval */}
                <div>
                    <label className="block font-semibold mb-1">Interval (minutes)</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={interval}
                        onChange={(e) => setInterval(parseInt(e.target.value, 10))}
                    >
                        <option value={5}>5 min</option>
                        <option value={10}>10 min</option>
                        <option value={15}>15 min</option>
                        <option value={20}>20 min</option>
                        <option value={30}>30 min</option>
                        <option value={60}>60 min</option>
                    </select>
                </div>

                {/* Generate Times Button */}
                <button
                    type="button"
                    onClick={generateTimes}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Generate Times
                </button>

                {/* Display generated times */}
                {generatedTimes.length > 0 && (
                    <div className="border bg-gray-50 p-4 rounded">
                        <p className="font-semibold mb-2">Generated Times:</p>
                        <div className="flex flex-wrap gap-2">
                            {generatedTimes.map((t, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`bg-purple-600 text-white px-4 py-2 rounded ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add Time Block"}
                </button>
            </form>
        </div>
    );
}