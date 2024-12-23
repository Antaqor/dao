// ===============================================================
// app/categories/page.tsx
// Displays all categories and their associated sub-services
// ===============================================================
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    subServices: string[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                // Fetch categories from backend
                const res = await axios.get("http://152.42.243.146:5001/api/categories");
                setCategories(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch categories.");
            }
        })();
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Categories</h1>
            <ul className="space-y-6">
                {categories.map((cat) => (
                    <li key={cat._id} className="border p-4 rounded">
                        <h2 className="text-lg font-semibold">{cat.name}</h2>
                        <div className="mt-2">
                            <p className="font-semibold">Sub-Services:</p>
                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-700">
                                {cat.subServices.map((sub, idx) => (
                                    <li key={idx}>{sub}</li>
                                ))}
                            </ul>
                        </div>
                        {/* Optional link to view services in this category */}
                        <Link
                            href={`/categories/${cat._id}/services`}
                            className="inline-block bg-black text-white px-4 py-2 mt-4 rounded"
                        >
                            View Services in {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}