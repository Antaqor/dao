"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [salon, setSalon] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [stylists, setStylists] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (session?.user?.accessToken && session.user.role === "owner") {
                    const token = session.user.accessToken;

                    // get owner salon
                    const salonRes = await axios.get("http://localhost:5001/api/salons/my-salon", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSalon(salonRes.data);

                    // get services
                    const servRes = await axios.get(`http://localhost:5001/api/services/salon/${salonRes.data._id}`);
                    setServices(servRes.data);

                    // get stylists
                    const styRes = await axios.get(`http://localhost:5001/api/stylists/salon/${salonRes.data._id}`);
                    setStylists(styRes.data);

                    // gather appointments for each service
                    let allAppointments: any[] = [];
                    for (let svc of servRes.data) {
                        const aRes = await axios.get(`http://localhost:5001/api/appointments?serviceId=${svc._id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        allAppointments = allAppointments.concat(aRes.data);
                    }
                    setAppointments(allAppointments);

                }
            } catch (err: any) {
                console.error("Error loading dashboard:", err);
                setError("Failed to load dashboard data.");
            }
        };
        fetchData();
    }, [session]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user || session.user.role !== "owner") return <p>You must be an owner to view this page.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {salon ? (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold">{salon.name}</h2>
                    <p className="text-gray-600">{salon.location}</p>
                </div>
            ) : (
                <p className="text-red-500">No salon found. Please create your salon first.</p>
            )}

            <div className="mb-8">
                <h3 className="text-lg font-bold">Services</h3>
                <ul className="mt-2 space-y-2">
                    {services.map(s => (
                        <li key={s._id} className="border p-3 rounded">
                            {s.name} - {s.durationMinutes} min - ${s.price}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold">Stylists</h3>
                <ul className="mt-2 space-y-2">
                    {stylists.map(st => (
                        <li key={st._id} className="border p-3 rounded">
                            {st.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold">Appointments</h3>
                <ul className="mt-2 space-y-2">
                    {appointments.map(appt => (
                        <li key={appt._id} className="border p-3 rounded">
                            <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
                            <br />
                            <strong>Time:</strong> {appt.startTime}
                            <br />
                            <strong>Service:</strong> {appt.service?.name}
                            <br />
                            <strong>User:</strong> {appt.user?.username}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-x-3">
                <a href="/dashboard/create-salon" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create/Update Salon
                </a>
                <a href="/dashboard/create-service" className="bg-green-600 text-white px-4 py-2 rounded">
                    Create Service
                </a>
                <a href="/dashboard/create-stylist" className="bg-yellow-600 text-white px-4 py-2 rounded">
                    Create Stylist
                </a>
                <a href="/dashboard/create-time-block" className="bg-purple-600 text-white px-4 py-2 rounded">
                    Add Time Blocks
                </a>
            </div>
        </div>
    );
}