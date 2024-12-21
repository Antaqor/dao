"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Service {
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
    // other fields if needed
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
                setError("Failed to fetch services");
            }
        })();
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Top Services</h1>
            <ul className="space-y-4">
                {services.map((srv) => (
                    <li key={srv._id} className="border p-4 rounded">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{srv.name}</h2>
                                <p className="text-gray-600">${srv.price} - {srv.durationMinutes} min</p>
                            </div>
                            <Link href={`/services/${srv._id}`} className="bg-black text-white px-4 py-2 rounded">
                                See Times
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}