//app/services/page.tsx
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

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("http://152.42.243.146:5001/api/services");
                setServices(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch services.");
            }
        })();
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Services</h1>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((srv) => (
                    <li key={srv._id} className="border p-4 rounded shadow hover:shadow-md transition-shadow">
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-lg font-semibold text-gray-800">{srv.name}</h2>
                            <p className="text-gray-600">
                                ${srv.price} - {srv.durationMinutes} min
                            </p>
                            <Link
                                href={`/services/${srv._id}`}
                                className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                See Times
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}