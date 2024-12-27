"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CreateSalonResponse {
    message: string;
}

interface ErrorResponse {
    error: string;
}

export default function NewSalonPage() {
    const [name, setName] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <p>Loading...</p>;

    if (!session?.user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please log in to create a new salon.</p>
            </div>
        );
    }

    const handleCreateSalon = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await axios.post<CreateSalonResponse>(
                "http://152.42.243.146/api/salons",
                { name, location },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                }
            );
            if (response.status === 201) {
                setMessage("Salon created successfully!");
                setTimeout(() => {
                    router.push("/salons");
                }, 2000);
            } else {
                setMessage("Failed to create salon. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                setMessage(axiosError.response?.data.error || "An error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
            console.error("Error creating salon:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Create a New Salon</h1>
            <form onSubmit={handleCreateSalon} className="space-y-4">
                <div>
                    <label htmlFor="salonName" className="block mb-1 font-semibold">
                        Salon Name
                    </label>
                    <input
                        id="salonName"
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="e.g., Stylish Cuts"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="salonLocation" className="block mb-1 font-semibold">
                        Location
                    </label>
                    <input
                        id="salonLocation"
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="e.g., 123 Main Street"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Create Salon
                </button>
            </form>
            {message && <p className="mt-4 text-center font-medium">{message}</p>}
        </div>
    );
}