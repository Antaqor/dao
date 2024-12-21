"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
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

    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [date, setDate] = useState("");
    const [startHour, setStartHour] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | "evening" | "">("");

    // Fetch salon, services, and stylists
    useEffect(() => {
        if (!params?.id) return;
        (async () => {
            try {
                const salonRes = await axios.get(`http://localhost:5001/api/salons/${params.id}`);
                setSalon(salonRes.data);

                const serviceRes = await axios.get(`http://localhost:5001/api/services/salon/${params.id}`);
                setServices(serviceRes.data);

                const stylistRes = await axios.get(`http://localhost:5001/api/stylists/salon/${params.id}`);
                setStylists(stylistRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, [params]);

    // Show a loading state while NextAuth session is being determined
    if (status === "loading") return <p>Loading...</p>;

    // If user is not logged in, prompt to log in
    if (!session?.user) {
        return <p>Please log in to book an appointment.</p>;
    }

    // Book the appointment
    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        let chosenHour = startHour;
        if (timeSlot === "morning") chosenHour = 9;  // Example: 9 AM
        else if (timeSlot === "afternoon") chosenHour = 13; // Example: 1 PM
        else if (timeSlot === "evening") chosenHour = 17; // Example: 5 PM

        if (!serviceId || !stylistId || !date || chosenHour == null) {
            setMessage("Please fill all fields.");
            return;
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
                    headers: {
                        // Replace with your token shape if you have a specific type
                        Authorization: `Bearer ${(session.user as { accessToken: string }).accessToken}`,
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

    // Simple component for time-slot selection
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

            <div className="mb-6">
                <label className="block font-semibold mb-1">Choose Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

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
