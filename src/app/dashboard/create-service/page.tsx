"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function CreateServicePage() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [duration, setDuration] = useState(30);
    const [price, setPrice] = useState(50);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5001/api/services/my-service", {
                name,
                durationMinutes: duration,
                price
            },{
                headers: { Authorization: `Bearer ${session.user.accessToken}` }
            });
            if (res.status === 201) {
                setMessage("Service created successfully!");
            }
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.error || "Error creating service");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add New Service</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Service Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Duration (minutes)</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={e => setDuration(parseInt(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Price ($)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(parseInt(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create
                </button>
            </form>
        </div>
    );
}