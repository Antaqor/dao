// app/dashboard/create-service/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Category {
    _id: string;
    name: string;
}

export default function CreateServicePage() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [duration, setDuration] = useState<number>(30);
    const [price, setPrice] = useState<number>(50);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch categories so owner can select one
    useEffect(() => {
        (async () => {
            try {
                const catRes = await axios.get("http://localhost:5001/api/categories");
                setCategories(catRes.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        })();
    }, []);

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
        if (!selectedCategoryId) {
            setMessage("Please select a category.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "http://localhost:5001/api/services/my-service",
                {
                    name: name.trim(),
                    durationMinutes: duration,
                    price,
                    categoryId: selectedCategoryId,
                },
                {
                    headers: { Authorization: `Bearer ${session.user.accessToken}` },
                }
            );

            if (response.status === 201) {
                setMessage("Service created successfully!");
                setName("");
                setDuration(30);
                setPrice(50);
                setSelectedCategoryId("");
            } else {
                setMessage("Failed to create service. Please try again.");
            }
        } catch (error) {
            console.error("Error creating service:", error);
            setMessage("An unexpected error occurred.");
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
                        onChange={(e) => setName(e.target.value)}
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
                        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
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
                        onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                        className="border p-2 w-full rounded"
                        min={0}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block font-semibold">
                        Category
                    </label>
                    <select
                        id="category"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="">-- Choose category --</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    } transition-colors`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    );
}