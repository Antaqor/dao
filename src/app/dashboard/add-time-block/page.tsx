"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function AddTimeBlockPage() {
    const { data: session } = useSession();
    const [serviceId, setServiceId] = useState("");
    const [blockLabel, setBlockLabel] = useState("Morning");
    const [timesStr, setTimesStr] = useState("");
    const [message, setMessage] = useState("");

    // timesStr could be something like "09:00 AM,09:15 AM,09:30 AM"
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) {
            setMessage("Please log in as owner.");
            return;
        }

        const times = timesStr.split(",").map(t => t.trim());
        try {
            const res = await axios.post(`http://localhost:5001/api/services/${serviceId}/time-blocks`, {
                blockLabel,
                times
            },{
                headers: { Authorization: `Bearer ${session.user.accessToken}` }
            });
            if (res.status === 200) {
                setMessage("Time block added!");
            }
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.error || "Error adding time block");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Time Block to Service</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Service ID</label>
                    <input
                        type="text"
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        className="border w-full p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Block Label</label>
                    <select
                        value={blockLabel}
                        onChange={e => setBlockLabel(e.target.value)}
                        className="border w-full p-2 rounded"
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        {/* or custom */}
                    </select>
                </div>
                <div>
                    <label className="block font-semibold">Times (comma separated)</label>
                    <input
                        type="text"
                        placeholder="e.g. 09:00 AM,09:15 AM,09:30 AM"
                        value={timesStr}
                        onChange={e => setTimesStr(e.target.value)}
                        className="border w-full p-2 rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Add Block
                </button>
            </form>
        </div>
    );
}