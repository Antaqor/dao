// =====================================================================
// 1) HOMEPAGE (app/page.tsx)
//    - Shows categories on the homepage so users can select a category
// =====================================================================
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    subServices: string[];
}

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // Fetch categories for homepage
                const res = await axios.get("http://152.42.243.146:5001/api/categories");
                setCategories(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch categories.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p className="p-4">Loading categories...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to My Salon Booking</h1>
            <p className="mb-4">
                Please select a category to see related services and start your booking.
            </p>
            {categories.length === 0 && <p>No categories found.</p>}
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <li key={cat._id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
                        <p className="text-gray-500 text-sm">
                            Sub-Services: {cat.subServices.join(", ")}
                        </p>
                        <Link
                            href={`/categories/${cat._id}/services`}
                            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            View {cat.name} Services
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}