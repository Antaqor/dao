"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

interface Service {
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
}

interface Stylist {
    _id: string;
    name: string;
}

interface Salon {
    _id: string;
    name: string;
    location: string;
}

export default function BookAppointmentPage() {
    const { data: session, status } = useSession();
    const params = useParams() as { id?: string } | null;
    const router = useRouter();

    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");

    // The user-chosen date
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [time, setTime] = useState("09:00");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!params?.id) return;
        (async () => {
            try {
                // Fetch the salon
                const salonRes = await axios.get<Salon>(
                    `http://152.42.243.146/api/salons/${params.id}`
                );
                setSalon(salonRes.data);

                // Fetch services for that salon
                const serviceRes = await axios.get<Service[]>(
                    `http://152.42.243.146/api/services/salon/${params.id}`
                );
                setServices(serviceRes.data);

                // Fetch stylists for that salon
                const stylistRes = await axios.get<Stylist[]>(
                    `http://152.42.243.146/api/stylists/salon/${params.id}`
                );
                setStylists(stylistRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, [params]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user) {
        return <p>Please log in to book an appointment.</p>;
    }

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!serviceId || !date || !time) {
            setMessage("Please fill all required fields.");
            return;
        }

        try {
            const res = await axios.post(
                "http://152.42.243.146/api/appointments",
                {
                    serviceId,
                    stylistId: stylistId || null,
                    date,
                    startTime: time, // e.g. "09:00"
                },
                {
                    headers: {
                        Authorization: `Bearer ${
                            (session.user as { accessToken: string }).accessToken
                        }`,
                    },
                }
            );
            if (res.status === 201) {
                setMessage("Appointment booked successfully!");
                setTimeout(() => router.push("/"), 2000);
            }
        } catch (error: unknown) {
            console.error("Error booking appointment:", error);
            if (error instanceof AxiosError && error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("An error occurred.");
            }
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                {salon ? `Book at ${salon.name}` : "Book Appointment"}
            </h1>

            {message && <p className="mb-4 text-center font-medium text-red-600">{message}</p>}

            <form onSubmit={handleBook} className="space-y-4">
                {/* Date */}
                <div>
                    <label className="block font-semibold mb-1">Date:</label>
                    <input
                        type="date"
                        className="border p-2 w-full rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {/* Time */}
                <div>
                    <label className="block font-semibold mb-1">Time (HH:MM):</label>
                    <input
                        type="time"
                        className="border p-2 w-full rounded"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>

                {/* Service */}
                <div>
                    <label className="block font-semibold mb-1">Service:</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        required
                    >
                        <option value="">Select a service</option>
                        {services.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name} — ${s.price} — {s.durationMinutes}min
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stylist */}
                <div>
                    <label className="block font-semibold mb-1">Stylist (optional):</label>
                    <select
                        className="border p-2 w-full rounded"
                        value={stylistId}
                        onChange={(e) => setStylistId(e.target.value)}
                    >
                        <option value="">Any Stylist</option>
                        {stylists.map((st) => (
                            <option key={st._id} value={st._id}>
                                {st.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Book Appointment
                </button>
            </form>
        </div>
    );
}