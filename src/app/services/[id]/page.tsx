"use client";
import BookingSteps from "../../components/BookingSteps";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface ServiceData {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

export default function ServiceDetailsPage() {
    const params = useParams() as { id?: string };
    const router = useRouter();

    const [service, setService] = useState<ServiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!params.id) {
            setError("No service ID provided.");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const res = await axios.get<ServiceData>(
                    `http://localhost:5001/api/services/${params.id}`
                );
                setService(res.data);
            } catch (err) {
                console.error("Failed to fetch service:", err);
                setError("Unable to load service data.");
            } finally {
                setLoading(false);
            }
        })();
    }, [params.id]);

    if (loading) {
        return <p className="p-4">Loading service...</p>;
    }
    if (error) {
        return <p className="p-4 text-red-600">{error}</p>;
    }
    if (!service) {
        return <p className="p-4 text-gray-500">Service not found.</p>;
    }

    // Step 1: Show basic service info, user then continues to Step 2
    return (
        <div className="p-4 max-w-xl mx-auto">
            <BookingSteps currentStep={1} />
            <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
            <p className="mb-4 text-gray-700">
                Price: <strong>${service.price}</strong>
                &nbsp;|&nbsp; Duration: <strong>{service.durationMinutes} min</strong>
            </p>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => router.push(`/services/${service._id}/time`)}
            >
                Select Date &amp; Time
            </button>
        </div>
    );
}
