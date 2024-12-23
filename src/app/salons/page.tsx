"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Salon {
    _id: string;
    name: string;
    location: string;
}

export default function SalonsPage() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("http://152.42.243.146:5001/api/salons");
                setSalons(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch salons.");
            }
        })();
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Salons</h1>
            <ul className="space-y-4">
                {salons.map((salon) => (
                    <li
                        key={salon._id}
                        className="border p-4 rounded flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">{salon.name}</h2>
                            <p className="text-gray-600">{salon.location}</p>
                        </div>
                        <Link
                            href={`/salons/${salon._id}`}
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                            View Services
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}