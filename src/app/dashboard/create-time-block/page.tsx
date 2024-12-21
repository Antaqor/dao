"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Service {
    _id: string;
    name: string;
}

interface Stylist {
    _id: string;
    name: string;
}

export default function CreateTimeBlockPage() {
    const { data: session } = useSession();
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [serviceId, setServiceId] = useState("");
    const [stylistId, setStylistId] = useState("");
    const [label, setLabel] = useState("Morning");
    const [timesStr, setTimesStr] = useState(""); // comma separated
    const [message, setMessage] = useState("");

    useEffect(() => {
        // fetch the owner's salon -> get services, stylists
        const fetchOwnerData = async () => {
            if (!session?.user?.accessToken) return;
            try {
                const token = session.user.accessToken;
                const salonRes = await axios.get("http://localhost:5001/api/salons/my-salon", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const salonId = salonRes.data._id;

                // get services
                const servRes = await axios.get(`http://localhost:5001/api/services/salon/${salonId}`);
                setServices(servRes.data);

                // get stylists
                const styRes = await axios.get(`http://localhost:5001/api/stylists/salon/${salonId}`);
                setStylists(styRes.data);

            } catch (err: any) {
                console.error("Error loading owner data:", err);
                setMessage("Failed to load services/stylists.");
            }
        };
        fetchOwnerData();
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.accessToken) {
            setMessage("Please log in as owner.");
            return;
        }
        try {
            const token = session.user.accessToken;
            const timesArr = timesStr.split(",").map(t => t.trim());
            const res = await axios.post("http://localhost:5001/api/services/my-service/time-block", {
                serviceId,
                stylistId: stylistId || null,
                label,
                times: timesArr
            },{
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                setMessage("Time block added!");
            }
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.error || "Error adding time block");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Time Blocks</h1>
            {message && <p className="text-red-600 mb-2">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Select Service</label>
                    <select
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">-- choose service --</option>
                        {services.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Select Stylist (optional)</label>
                    <select
                        value={stylistId}
                        onChange={e => setStylistId(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">No stylist (global)</option>
                        {stylists.map(st => (
                            <option key={st._id} value={st._id}>{st.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Block Label</label>
                    <select
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                    </select>
                </div>

                <div>
                    <label className="block font-semibold">Times (comma separated)</label>
                    <input
                        type="text"
                        placeholder="e.g. 09:00 AM,09:15 AM"
                        value={timesStr}
                        onChange={e => setTimesStr(e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                </div>

                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
                    Add Time Block
                </button>
            </form>
        </div>
    );
}