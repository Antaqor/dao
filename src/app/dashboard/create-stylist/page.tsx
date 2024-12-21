"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function CreateStylistPage() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5001/api/stylists/my-stylist", {
                name
            },{
                headers: { Authorization: `Bearer ${session.user.accessToken}` }
            });
            if (res.status === 201) {
                setMessage("Stylist created successfully!");
            }
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.error || "Error creating stylist");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Create Stylist</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Stylist Name</label>
                    <input
                        type="text"
                        className="border p-2 w-full rounded"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Stylist
                </button>
            </form>
        </div>
    );
}