// src/app/appointments/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Appointment {
    _id: string;
    service: string;
    date: string;
    durationMinutes: number;
    stylist?: { username: string };
    status: string;
}

interface ApiError {
    error?: string;
    message?: string;
    [key: string]: unknown;
}

const AppointmentPage: React.FC = () => {
    const { data: session, status } = useSession();
    const [service, setService] = useState<string>('');
    const [stylistUsername, setStylistUsername] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [durationMinutes, setDurationMinutes] = useState<number>(60);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://152.42.243.146:5001';

    const fetchAppointments = useCallback(async () => {
        if (!session?.user?.accessToken) return;

        try {
            const res = await fetch(`${backendUrl}/api/appointments`, {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                },
            });
            if (!res.ok) throw new Error(`Error fetching appointments: ${res.status}`);
            const data: Appointment[] | ApiError = await res.json();
            if (Array.isArray(data)) {
                setAppointments(data);
            } else {
                setError(data.error || 'Failed to load appointments.');
            }
        } catch (err: unknown) {
            console.error("Failed to load appointments:", err);
            setError("Failed to load appointments.");
        }
    }, [session?.user?.accessToken, backendUrl]);

    const getStylistIdByUsername = async (username: string): Promise<string | null> => {
        try {
            const res = await fetch(`${backendUrl}/api/users/stylist/${username}`);
            if (!res.ok) throw new Error(`Error fetching stylist: ${res.status}`);
            const data = await res.json() as { id: string };
            return data.id;
        } catch (err) {
            console.error("Failed to fetch stylist ID:", err);
            return null;
        }
    };

    const createAppointment = async () => {
        if (!service || !stylistUsername || !date || !durationMinutes) {
            setError('All fields are required.');
            return;
        }

        setError(null);
        setMessage(null);

        const stylistId = await getStylistIdByUsername(stylistUsername);
        if (!stylistId) {
            setError("Stylist not found. Please check the username.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                },
                body: JSON.stringify({ service, stylistId, date, durationMinutes }),
            });

            const data: Appointment | ApiError = await res.json();
            if (!res.ok) {
                const errMsg = 'error' in data ? data.error : `Error creating appointment: ${res.status}`;
                throw new Error(errMsg);
            }

            setMessage('Appointment created successfully!');
            setService('');
            setStylistUsername('');
            setDate('');
            setDurationMinutes(60);
            fetchAppointments();
        } catch (err: unknown) {
            console.error("Failed to create appointment:", err);
            setError("Failed to create appointment.");
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAppointments();
        }
    }, [status, fetchAppointments]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <h1 className="text-white">Please sign in to book an appointment.</h1>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <h1 className="text-2xl mb-4">Book an Appointment</h1>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            {message && <div className="text-green-400 mb-2">{message}</div>}

            <div className="mb-4">
                <label className="block mb-1">Service (Үс засуулах or Сормуус хийлгэх)</label>
                <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                >
                    <option value="">Select a service</option>
                    <option value="Үс засуулах">Үс засуулах</option>
                    <option value="Сормуус хийлгэх">Сормуус хийлгэх</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-1">Stylist Username</label>
                <input
                    type="text"
                    value={stylistUsername}
                    onChange={(e) => setStylistUsername(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="Enter stylist's username"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">Date & Time</label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                />
                <span className="text-gray-400 text-sm">Select date and time for the appointment.</span>
            </div>

            <div className="mb-4">
                <label className="block mb-1">Duration (minutes)</label>
                <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="e.g. 60"
                />
                <span className="text-gray-400 text-sm">Enter the duration in minutes.</span>
            </div>

            <button
                onClick={createAppointment}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md"
            >
                Book Appointment
            </button>

            <h2 className="text-xl mt-8 mb-4">Your Appointments</h2>
            {appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((appt) => (
                        <div key={appt._id} className="bg-gray-800 p-4 rounded-md">
                            <p className="text-white font-semibold">{appt.service}</p>
                            <p className="text-gray-400 text-sm">
                                {new Date(appt.date).toLocaleString()} - {appt.durationMinutes} mins
                            </p>
                            <p className="text-gray-400 text-sm">Stylist: {appt.stylist?.username || 'N/A'}</p>
                            <p className="text-gray-400 text-sm">Status: {appt.status}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No appointments found.</p>
            )}
        </div>
    );
};

export default AppointmentPage;