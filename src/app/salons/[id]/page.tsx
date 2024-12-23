//salons/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Salon {
    _id: string;
    name: string;
    location: string;
}

interface Service {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

export default function SalonDetailPage() {
    const params = useParams() as { id?: string };
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!params.id) return;
        (async () => {
            try {
                // fetch salon
                const salonRes = await axios.get(`http://152.42.243.146:5001/api/salons/${params.id}`);
                setSalon(salonRes.data);

                // fetch services
                const servicesRes = await axios.get(`http://152.42.243.146:5001/api/services/salon/${params.id}`);
                setServices(servicesRes.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load salon/services.");
            }
        })();
    }, [params.id]);

    if (error) return <p className="text-red-600">{error}</p>;

    if (!salon) return <p>Loading salon...</p>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">{salon.name}</h1>
            <p className="text-gray-600">{salon.location}</p>

            <h2 className="text-xl font-semibold mt-6">Top Services</h2>
            <ul className="mt-4 space-y-4">
                {services.map(svc => (
                    <li key={svc._id} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{svc.name}</p>
                            <p className="text-gray-600">${svc.price} - {svc.durationMinutes} min</p>
                        </div>
                        <Link href={`/services/${svc._id}`} className="bg-black text-white px-4 py-2 rounded">
                            See Times
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}