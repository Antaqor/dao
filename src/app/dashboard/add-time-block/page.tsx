"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface AddTimeBlockResponse {
    message: string;
}

export default function AddTimeBlockPage() {
    const { data: session } = useSession();
    const [serviceId, setServiceId] = useState<string>("");
    const [blockLabel, setBlockLabel] = useState<string>("Morning");
    const [timesStr, setTimesStr] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    // Handle form submission to add a time block
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (!session?.user) {
            setMessage("Please log in as owner.");
            return;
        }

        // Split and trim the times string into an array
        const times = timesStr.split(",").map(t => t.trim()).filter(t => t !== "");

        if (times.length === 0) {
            setMessage("Please provide at least one valid time.");
            return;
        }

        try {
            const response = await axios.post<AddTimeBlockResponse>(
                `http://localhost:5001/api/services/${serviceId}/time-blocks`,
                {
                    blockLabel,
                    times
                },
                {
                    headers: { Authorization: `Bearer ${session.user.accessToken}` }
                }
            );

            if (response.status === 200) {
                setMessage("Time block added successfully!");
                // Reset form fields
                setServiceId("");
                setBlockLabel("Morning");
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
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Time Block to Service</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="serviceId" className="block font-semibold">
                        Service ID
                    </label>
                    <input
                        id="serviceId"
                        type="text"
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        className="border w-full p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="blockLabel" className="block font-semibold">
                        Block Label
                    </label>
                    <select
                        id="blockLabel"
                        value={blockLabel}
                        onChange={e => setBlockLabel(e.target.value)}
                        className="border w-full p-2 rounded"
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
                        placeholder="e.g. 09:00 AM,09:15 AM,09:30 AM"
                        value={timesStr}
                        onChange={e => setTimesStr(e.target.value)}
                        className="border w-full p-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                    Add Block
                </button>
            </form>
        </div>
    );
}