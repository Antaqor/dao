"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
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
    location: string;
}

interface CreateTimeBlockResponse {
    message: string;
}

export default function CreateTimeBlockPage() {
    const { data: session } = useSession();
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [serviceId, setServiceId] = useState<string>("");
    const [stylistId, setStylistId] = useState<string>("");
    const [label, setLabel] = useState<string>("Morning");
    const [timesStr, setTimesStr] = useState<string>(""); // comma separated
    const [message, setMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        // Fetch the owner's salon data, including services and stylists
        const fetchOwnerData = async () => {
            if (!session?.user?.accessToken) return;
            try {
                const token = session.user.accessToken;

                // Fetch salon information
                const salonRes = await axios.get<SalonResponse>(
                    "http://152.42.243.146:5001/api/salons/my-salon",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const salonId = salonRes.data._id;

                // Fetch services associated with the salon
                const servRes = await axios.get<Service[]>(
                    `http://152.42.243.146:5001/api/services/salon/${salonId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setServices(servRes.data);

                // Fetch stylists associated with the salon
                const styRes = await axios.get<Stylist[]>(
                    `http://152.42.243.146:5001/api/stylists/salon/${salonId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setStylists(styRes.data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ error: string }>;
                    setMessage(axiosError.response?.data.error || "Failed to load services/stylists.");
                } else {
                    setMessage("An unexpected error occurred.");
                }
                console.error("Error loading owner data:", error);
            }
        };
        fetchOwnerData();
    }, [session]);

    // Validate the times string format
    const validateTimes = (times: string[]): boolean => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        return times.every(time => timeRegex.test(time));
    };

    // Handle form submission to add a time block
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

        if (!label.trim()) {
            setMessage("Block label is required.");
            return;
        }

        const timesArr = timesStr.split(",").map(t => t.trim()).filter(t => t !== "");

        if (timesArr.length === 0) {
            setMessage("Please provide at least one valid time.");
            return;
        }

        if (!validateTimes(timesArr)) {
            setMessage("Please enter times in the format HH:MM AM/PM.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = session.user.accessToken;
            const response = await axios.post<CreateTimeBlockResponse>(
                "http://152.42.243.146:5001/api/services/my-service/time-block",
                {
                    serviceId,
                    stylistId: stylistId || null,
                    label: label.trim(),
                    times: timesArr,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setMessage("Time block added successfully!");
                // Reset form fields
                setServiceId("");
                setStylistId("");
                setLabel("Morning");
                setTimesStr("");
            } else {
                setMessage("Failed to add time block. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ error: string }>;
                setMessage(axiosError.response?.data.error || "Error adding time block.");
            } else {
                setMessage("An unexpected error occurred.");
            }
            console.error("Error adding time block:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Time Blocks</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="serviceSelect" className="block font-semibold">
                        Select Service
                    </label>
                    <select
                        id="serviceSelect"
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="">-- choose service --</option>
                        {services.map(service => (
                            <option key={service._id} value={service._id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="stylistSelect" className="block font-semibold">
                        Select Stylist (optional)
                    </label>
                    <select
                        id="stylistSelect"
                        value={stylistId}
                        onChange={e => setStylistId(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">No stylist (global)</option>
                        {stylists.map(stylist => (
                            <option key={stylist._id} value={stylist._id}>
                                {stylist.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="blockLabel" className="block font-semibold">
                        Block Label
                    </label>
                    <select
                        id="blockLabel"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="timesStr" className="block font-semibold">
                        Times (comma separated)
                    </label>
                    <input
                        id="timesStr"
                        type="text"
                        placeholder="e.g. 09:00 AM,09:15 AM"
                        value={timesStr}
                        onChange={e => setTimesStr(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`bg-purple-600 text-white px-4 py-2 rounded ${
                        isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-purple-700"
                    } transition-colors`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adding..." : "Add Time Block"}
                </button>
            </form>
        </div>
    );
}