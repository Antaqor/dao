"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface CreateSalonResponse {
    message: string;
}

export default function CreateSalonPage() {
    const { data: session } = useSession();
    const [name, setName] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    // Handle form submission to create or update a salon
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }

        try {
            const response = await axios.post<CreateSalonResponse>(
                "http://localhost:5001/api/salons/my-salon",
                {
                    name,
                    location
                },
                {
                    headers: { Authorization: `Bearer ${session.user.accessToken}` }
                }
            );

            if (response.status === 200 || response.status === 201) {
                setMessage("Salon created/updated successfully!");
                // Reset form fields
                setName("");
                setLocation("");
            } else {
                setMessage("Failed to create/update salon. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ error: string }>;
                setMessage(axiosError.response?.data.error || "Error creating/updating salon.");
            } else {
                setMessage("An unexpected error occurred.");
            }
            console.error("Error creating/updating salon:", error);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Create or Update Your Salon</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="salonName" className="block font-semibold">
                        Salon Name
                    </label>
                    <input
                        id="salonName"
                        type="text"
                        className="border p-2 w-full rounded"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="salonLocation" className="block font-semibold">
                        Location
                    </label>
                    <input
                        id="salonLocation"
                        type="text"
                        className="border p-2 w-full rounded"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Save
                </button>
            </form>
        </div>
    );
}