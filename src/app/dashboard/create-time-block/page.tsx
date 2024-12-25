"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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

/**
 * A page to create time blocks for a specific service, optionally tied to a stylist.
 * When the label is set to Morning/Afternoon/Evening, we auto-fill start/end times.
 * If it's "Custom," the user can freely edit the times.
 */
export default function CreateTimeBlockPage() {
    const { data: session } = useSession();

    // ========== Data for dropdowns ==========
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);

    // ========== Form fields ==========
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [label, setLabel] = useState("Morning");

    // Date defaults to "today"
    const [date, setDate] = useState<string>(() => {
        const now = new Date();
        return now.toISOString().split("T")[0];
    });

    // Times
    const [startTime, setStartTime] = useState("08:00"); // default Morning
    const [endTime, setEndTime] = useState("11:59");     // default Morning
    const [interval, setInterval] = useState(15);

    // Generated time slots
    const [generatedTimes, setGeneratedTimes] = useState<string[]>([]);

    // Status
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ====== UseEffect: fetch services & stylists ======
    useEffect(() => {
        const fetchOwnerData = async () => {
            if (!session?.user?.accessToken) return;

            try {
                setMessage("");
                const token = session.user.accessToken;

                // 1) Fetch the salon
                const salonRes = await axios.get<SalonResponse>(
                    "http://152.42.243.146:5001/api/salons/my-salon",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const salonId = salonRes.data._id;

                // 2) Fetch services
                const servRes = await axios.get<Service[]>(
                    `http://152.42.243.146:5001/api/services/salon/${salonId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServices(servRes.data);

                // 3) Fetch stylists
                const styRes = await axios.get<Stylist[]>(
                    `http://152.42.243.146:5001/api/stylists/salon/${salonId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStylists(styRes.data);
            } catch (error) {
                console.error("Error loading owner data:", error);
                setMessage("Failed to load services/stylists. Please refresh.");
            }
        };

        fetchOwnerData();
    }, [session]);

    // ====== Helpers ======
    /** Auto-update start/end times if label != Custom */
    const handleLabelChange = (val: string) => {
        setLabel(val);

        if (val === "Morning") {
            setStartTime("08:00");
            setEndTime("11:59");
        } else if (val === "Afternoon") {
            setStartTime("12:00");
            setEndTime("17:59");
        } else if (val === "Evening") {
            setStartTime("18:00");
            setEndTime("20:59");
            // or "20:59" or "21:00" based on your preference
        } else {
            // Custom -> do not auto-update times, let the user choose
        }

        // Clear any previously generated times
        setGeneratedTimes([]);
    };

    /** Generate time slots */
    const generateTimes = () => {
        setGeneratedTimes([]);
        setMessage("");

        if (!date) {
            setMessage("Please pick a date first.");
            return;
        }

        // Parse times
        const [startHrStr, startMinStr] = startTime.split(":");
        const [endHrStr, endMinStr] = endTime.split(":");
        const startHr = parseInt(startHrStr, 10);
        const startMin = parseInt(startMinStr, 10);
        const endHr = parseInt(endHrStr, 10);
        const endMin = parseInt(endMinStr, 10);

        // Validate
        if (endHr < startHr || (endHr === startHr && endMin <= startMin)) {
            setMessage("End time must be after start time.");
            return;
        }

        const current = new Date(`2022-01-01T${startTime}:00`);
        const finish = new Date(`2022-01-01T${endTime}:00`);
        const results: string[] = [];

        // Format e.g. "08:15 AM"
        const formatTime = (d: Date) => {
            let hh = d.getHours();
            const mm = d.getMinutes();
            const suffix = hh >= 12 ? "PM" : "AM";

            if (hh === 0) hh = 12;
            else if (hh > 12) hh -= 12;

            const mmStr = String(mm).padStart(2, "0");
            return `${hh}:${mmStr} ${suffix}`;
        };

        // Step through in the given interval
        while (current <= finish) {
            results.push(formatTime(current));
            current.setMinutes(current.getMinutes() + interval);
        }
        setGeneratedTimes(results);
    };

    /** Submit form to create the time block */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner first.");
            return;
        }
        if (!serviceId) {
            setMessage("Please select a service.");
            return;
        }
        if (!date) {
            setMessage("Please pick a date.");
            return;
        }
        if (generatedTimes.length === 0) {
            setMessage("No times generated. Click 'Generate Times' first.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = session.user.accessToken;
            const payload = {
                serviceId,
                stylistId: stylistId || null,
                date,
                label,
                times: generatedTimes,
            };

            const res = await axios.post(
                "http://152.42.243.146:5001/api/services/my-service/time-block",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 201) {
                setMessage("Time block added successfully!");
                // Reset form
                setServiceId("");
                setStylistId("");
                setLabel("Morning");
                setDate(new Date().toISOString().split("T")[0]);
                setStartTime("08:00");
                setEndTime("11:59");
                setInterval(15);
                setGeneratedTimes([]);
            } else {
                setMessage("Failed to add time block. Please try again.");
            }
        } catch (error) {
            console.error("Error adding time block:", error);
            setMessage("An unexpected error occurred adding the time block.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ====== Render ======
    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create Time Blocks</h1>
            {message && (
                <p className="mb-4 text-sm font-semibold text-red-600">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* SERVICE */}
                <div>
                    <label className="block font-semibold mb-1">Service</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        required
                    >
                        <option value="">-- select a service --</option>
                        {services.map((srv) => (
                            <option key={srv._id} value={srv._id}>
                                {srv.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* STYLIST */}
                <div>
                    <label className="block font-semibold mb-1">Stylist (Optional)</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={stylistId}
                        onChange={(e) => setStylistId(e.target.value)}
                    >
                        <option value="">No specific stylist</option>
                        {stylists.map((sty) => (
                            <option key={sty._id} value={sty._id}>
                                {sty.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* LABEL */}
                <div>
                    <label className="block font-semibold mb-1">Time Block Label</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={label}
                        onChange={(e) => handleLabelChange(e.target.value)}
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>

                {/* DATE */}
                <div>
                    <label className="block font-semibold mb-1">Date</label>
                    <input
                        type="date"
                        className="border p-2 w-full rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                {/* START/END TIME */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">Start Time</label>
                        <input
                            type="time"
                            className="border p-2 w-full rounded"
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                setGeneratedTimes([]);
                            }}
                            // If label != Custom, user can't override the auto times
                            disabled={label !== "Custom"}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">End Time</label>
                        <input
                            type="time"
                            className="border p-2 w-full rounded"
                            value={endTime}
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                setGeneratedTimes([]);
                            }}
                            disabled={label !== "Custom"}
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
                        {[5, 10, 15, 20, 30, 60].map((val) => (
                            <option key={val} value={val}>
                                {val} min
                            </option>
                        ))}
                    </select>
                </div>

                {/* Generate Times */}
                <button
                    type="button"
                    onClick={generateTimes}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                    Generate Times
                </button>

                {/* Display generated times */}
                {generatedTimes.length > 0 && (
                    <div className="border bg-gray-50 p-4 rounded">
                        <p className="font-semibold mb-2">Generated Times:</p>
                        <div className="flex flex-wrap gap-2">
                            {generatedTimes.map((t, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                                >
                  {t}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className={`bg-purple-600 text-white px-4 py-2 rounded 
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"}
          `}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add Time Block"}
                </button>
            </form>
        </div>
    );
}