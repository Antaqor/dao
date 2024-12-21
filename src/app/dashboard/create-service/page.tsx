"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface CreateServiceResponse {
    message: string;
}

export default function CreateServicePage() {
    const { data: session } = useSession();
    const [name, setName] = useState<string>("");
    const [duration, setDuration] = useState<number>(30);
    const [price, setPrice] = useState<number>(50);
    const [message, setMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Handle form submission to create a new service
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }

        if (!name.trim()) {
            setMessage("Service name is required.");
            return;
        }

        if (duration <= 0) {
            setMessage("Duration must be a positive number.");
            return;
        }

        if (price < 0) {
            setMessage("Price cannot be negative.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post<CreateServiceResponse>(
                "http://localhost:5001/api/services/my-service",
                {
                    name: name.trim(),
                    durationMinutes: duration,
                    price
                },
                {
                    headers: { Authorization: `Bearer ${session.user.accessToken}` }
                }
            );

            if (response.status === 201) {
                setMessage("Service created successfully!");
                // Reset form fields
                setName("");
                setDuration(30);
                setPrice(50);
            } else {
                setMessage("Failed to create service. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ error: string }>;
                setMessage(axiosError.response?.data.error || "Error creating service.");
            } else {
                setMessage("An unexpected error occurred.");
            }
            console.error("Error creating service:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add New Service</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="serviceName" className="block font-semibold">
                        Service Name
                    </label>
                    <input
                        id="serviceName"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="duration" className="block font-semibold">
                        Duration (minutes)
                    </label>
                    <input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={e => setDuration(parseInt(e.target.value, 10))}
                        className="border p-2 w-full rounded"
                        min={1}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block font-semibold">
                        Price ($)
                    </label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={e => setPrice(parseInt(e.target.value, 10))}
                        className="border p-2 w-full rounded"
                        min={0}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded ${
                        isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-700"
                    } transition-colors`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    );
}