"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function CreateSalonPage() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5001/api/salons/my-salon", {
                name,
                location
            },{
                headers: { Authorization: `Bearer ${session.user.accessToken}` }
            });
            if (res.status === 200 || res.status === 201) {
                setMessage("Salon created/updated successfully!");
            }
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.error || "Error creating/updating salon");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Create or Update Your Salon</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Salon Name</label>
                    <input
                        type="text"
                        className="border p-2 w-full rounded"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Location</label>
                    <input
                        type="text"
                        className="border p-2 w-full rounded"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </form>
        </div>
    );
}