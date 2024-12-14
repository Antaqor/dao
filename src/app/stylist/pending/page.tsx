// src/app/stylist/pending/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Appointment {
    _id: string;
    service: string;
    date: string;
    durationMinutes: number;
    user?: { username: string };
    status: string;
}

interface ApiError {
    error?: string;
    [key: string]: unknown;
}

const StylistPendingAppointments: React.FC = () => {
    const { data: session, status } = useSession();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState<string>('');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001';

    const fetchPendingAppointments = useCallback(async () => {
        if (!session?.user?.accessToken) return;
        try {
            const res = await fetch(`${backendUrl}/api/appointments/stylist/pending`, {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                },
            });
            if (!res.ok) throw new Error(`Error fetching pending appointments: ${res.status}`);
            const data: Appointment[] | ApiError = await res.json();
            if (Array.isArray(data)) {
                setAppointments(data);
            } else {
                setError(data.error || 'Failed to load pending appointments.');
            }
        } catch (err) {
            console.error("Failed to load pending appointments:", err);
            setError("Failed to load pending appointments.");
        }
    }, [session?.user?.accessToken, backendUrl]);

    const decideAppointment = async (appointmentId: string, decision: 'confirmed' | 'canceled') => {
        if (!session?.user?.accessToken) return;
        setError(null);
        setMessage(null);
        try {
            const body: { decision: string; newDate?: string } = { decision };
            if (decision === 'confirmed' && rescheduleDate) {
                body.newDate = rescheduleDate;
            }

            const res = await fetch(`${backendUrl}/api/appointments/${appointmentId}/decide`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.accessToken}`,
                },
                body: JSON.stringify(body),
            });
            const data: Appointment | ApiError = await res.json();
            if (!res.ok) {
                const errMsg = 'error' in data ? data.error : `Error updating appointment: ${res.status}`;
                throw new Error(errMsg);
            }
            setMessage(`Appointment ${decision === 'confirmed' ? 'approved' : 'canceled'} successfully!`);
            setRescheduleDate('');
            fetchPendingAppointments();
        } catch (err: unknown) {
            console.error("Failed to update appointment:", err);
            setError("Failed to update appointment.");
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchPendingAppointments();
        }
    }, [status, fetchPendingAppointments]);

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
                <h1 className="text-white">Please sign in as a stylist to view pending appointments.</h1>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white p-4">
            <h1 className="text-2xl mb-4">Pending Appointments</h1>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            {message && <div className="text-green-400 mb-2">{message}</div>}
            {appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((appt) => (
                        <div key={appt._id} className="bg-gray-800 p-4 rounded-md">
                            <p className="text-white font-semibold">Service: {appt.service}</p>
                            <p className="text-gray-400 text-sm">
                                {new Date(appt.date).toLocaleString()} - {appt.durationMinutes} mins
                            </p>
                            <p className="text-gray-400 text-sm">User: {appt.user?.username || 'N/A'}</p>
                            <p className="text-gray-400 text-sm">Status: {appt.status}</p>
                            <div className="mt-2">
                                <label className="block mb-1 text-sm text-gray-300">Reschedule Date &amp; Time (Optional):</label>
                                <input
                                    type="datetime-local"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="w-full p-2 bg-gray-700 text-white rounded-md"
                                />
                            </div>
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => decideAppointment(appt._id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-md"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => decideAppointment(appt._id, 'canceled')}
                                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No pending appointments.</p>
            )}
        </div>
    );
};

export default StylistPendingAppointments;