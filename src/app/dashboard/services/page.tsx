"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Service {
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("http://152.42.243.146/api/services");
                setServices(res.data);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Failed to fetch services.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        // Simple "loading" message. Could do skeleton if you want more style
        return <p className="p-4">Loading services...</p>;
    }
    if (error) {
        return <p className="p-4 text-red-600">{error}</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Services</h1>
            {services.length === 0 && <p>No services found.</p>}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((srv) => (
                    <li
                        key={srv._id}
                        className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            {srv.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                            ${srv.price} – {srv.durationMinutes} min
                        </p>
                        <Link
                            href={`/services/${srv._id}`}
                            className="inline-block mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            View / Book
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}