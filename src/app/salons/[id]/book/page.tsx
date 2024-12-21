"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

// Example interfaces (adjust as needed)
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

    // Page state
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [date, setDate] = useState("");
    const [startHour, setStartHour] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    // Time-slot approach for Morning, Afternoon, Evening (to mimic the screenshot style)
    const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening" | "">("");

    // On mount, fetch the salon, services, stylists
    useEffect(() => {
        if (!params?.id) return;  // If no ID, abort

        (async () => {
            try {
                // Get the salon for display
                const salonRes = await axios.get(`http://localhost:5001/api/salons/${params.id}`);
                setSalon(salonRes.data);

                // Get services
                const serviceRes = await axios.get(`http://localhost:5001/api/services/salon/${params.id}`);
                setServices(serviceRes.data);

                // Get stylists
                const stylistRes = await axios.get(`http://localhost:5001/api/stylists/salon/${params.id}`);
                setStylists(stylistRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        })();
    }, [params]);

    // If NextAuth session is still loading, show a spinner
    if (status === "loading") return <p>Loading...</p>;

    // If user not logged in, prompt them to log in
    if (!session?.user) {
        return <p>Please log in to book an appointment.</p>;
    }

    // Handle booking
    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        // If you want to map morning/afternoon/evening to actual hours:
        let chosenHour = startHour;
        if (timeSlot === "morning") {
            chosenHour = 9;  // Example: 9 AM
        } else if (timeSlot === "afternoon") {
            chosenHour = 13; // Example: 1 PM
        } else if (timeSlot === "evening") {
            chosenHour = 17; // Example: 5 PM
        }

        if (!serviceId || !stylistId || !date || chosenHour == null) {
            return setMessage("Please fill all fields.");
        }

        try {
            const res = await axios.post(
                "http://localhost:5001/api/appointments",
                {
                    serviceId,
                    stylistId,
                    date,
                    startHour: chosenHour,
                },
                {
                    headers: { Authorization: `Bearer ${session.user.accessToken}` },
                }
            );

            if (res.status === 201) {
                setMessage("Appointment booked successfully!");
                setTimeout(() => router.push("/"), 2000);
            }
        } catch (err: any) {
            console.error("Error booking appointment:", err);
            setMessage(err.response?.data?.error || "An error occurred.");
        }
    };

    // A simple function for a "time pill" style button
    const TimePill = ({
                          label,
                          value,
                      }: {
        label: string;
        value: "morning" | "afternoon" | "evening";
    }) => (
        <button
            type="button"
            onClick={() => setTimeSlot(value)}
            className={`px-4 py-2 rounded border ${
                timeSlot === value ? "bg-black text-white" : "bg-white text-black"
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                {salon ? `Book Appointment at ${salon.name}` : "Book Appointment"}
            </h1>

            {message && <p className="mb-4 text-center font-medium text-red-600">{message}</p>}

            {/* Simple "calendar" placeholder */}
            <div className="mb-6">
                <label className="block font-semibold mb-1">Choose Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Time-slot selection (Morning / Afternoon / Evening) */}
            <div className="mb-6">
                <p className="font-semibold mb-1">Choose Time Slot:</p>
                <div className="flex space-x-2">
                    <TimePill label="Morning" value="morning" />
                    <TimePill label="Afternoon" value="afternoon" />
                    <TimePill label="Evening" value="evening" />
                </div>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
                <div>
                    <label className="block font-semibold">Service:</label>
                    <select
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">Select a service</option>
                        {services.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name} - ${s.price} - {s.durationMinutes}min
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Stylist:</label>
                    <select
                        value={stylistId}
                        onChange={(e) => setStylistId(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">Select a stylist</option>
                        {stylists.map((st) => (
                            <option key={st._id} value={st._id}>
                                {st.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/*
            If you also want a manual startHour override, keep it here.
            Or remove it if you only allow morning/afternoon/evening.
         */}
                <div>
                    <label className="block font-semibold">Or Select Specific Start Hour (0-23):</label>
                    <input
                        type="number"
                        value={startHour ?? ""}
                        onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
                        className="border p-2 w-full rounded"
                        min={0}
                        max={23}
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Book Appointment
                </button>
            </form>
        </div>
    );
}