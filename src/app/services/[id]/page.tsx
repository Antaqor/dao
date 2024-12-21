"use client";
import React, { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Calendar from "react-calendar";
import type { Value } from "react-calendar/dist/cjs/shared/types"; // Import Value type
import "react-calendar/dist/Calendar.css";

interface StylistTimeBlock {
    stylist: {
        _id: string;
        name: string;
    } | null;
    timeBlocks: {
        label: string;
        times: string[];
    }[];
}

interface ServiceData {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

interface ServiceParams {
    id?: string;
}

export default function ServiceBookingPage() {
    const params = useParams() as ServiceParams;
    const { data: session } = useSession();

    const [service, setService] = useState<ServiceData | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [stylistBlocks, setStylistBlocks] = useState<StylistTimeBlock[]>([]);
    const [message, setMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedStylistId, setSelectedStylistId] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [step, setStep] = useState<1 | 2>(1);
    const [timer, setTimer] = useState<number>(300);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!params.id) return;
        (async () => {
            try {
                const sRes = await axios.get<ServiceData>(`http://152.42.243.146:5001/api/services/${params.id}`);
                setService(sRes.data);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    console.error("Failed to fetch service:", error.message);
                } else {
                    console.error("Failed to fetch service:", error);
                }
            }
        })();
    }, [params.id]);

    useEffect(() => {
        if (!params.id || !date) return;
        (async () => {
            try {
                const dateStr = date.toISOString().split("T")[0];
                const avRes = await axios.get<StylistTimeBlock[]>(
                    `http://152.42.243.146:5001/api/services/${params.id}/availability`,
                    { params: { date: dateStr } }
                );
                setStylistBlocks(avRes.data);
            } catch (error: unknown) {
                console.error(error);
                setMessage("Failed to load availability");
            }
        })();
    }, [params.id, date]);

    // Timer logic for 5-minute payment window
    useEffect(() => {
        if (showModal && step === 2) {
            setTimer(300);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        setShowModal(false);
                        setMessage("Time expired! Please select time again.");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [showModal, step]);

    // Safely handle 'Value' from react-calendar
    const handleCalendarChange = (val: Value) => {
        if (Array.isArray(val)) {
            setDate(val[0] || null);
        } else {
            setDate(val || null);
        }
    };

    const openModal = (styId: string | null, time: string) => {
        if (!session?.user) {
            setMessage("Please log in to book an appointment.");
            return;
        }
        setSelectedStylistId(styId);
        setSelectedTime(time);
        setStep(1);
        setShowModal(true);
    };

    const handleProceedToPayment = () => {
        setStep(2);
    };

    const handleConfirmPayment = async () => {
        if (!session?.user || !params.id || !date || !selectedTime) {
            setMessage("Missing information to book appointment.");
            return;
        }
        try {
            const dateStr = date.toISOString().split("T")[0];
            const res = await axios.post(
                "http://152.42.243.146:5001/api/appointments",
                {
                    serviceId: params.id,
                    stylistId: selectedStylistId,
                    date: dateStr,
                    startTime: selectedTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${(session.user as { accessToken: string }).accessToken}`,
                    },
                }
            );
            if (res.status === 201) {
                setMessage("Appointment booked successfully!");
            }
            setShowModal(false);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Error booking appointment");
            }
        }
    };

    if (!service) return <p className="p-4">Loading service...</p>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
            <p className="text-gray-600 mb-4">
                ${service.price} - {service.durationMinutes} min
            </p>

            {message && <p className="text-red-600 mb-2">{message}</p>}

            <Calendar
                onChange={handleCalendarChange}
                value={date}
                className="border rounded p-2"
            />

            {date && (
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Times for {date.toDateString()}</h2>
                    {stylistBlocks.map((sb, idx) => (
                        <div key={idx} className="mb-6 border p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">
                                {sb.stylist ? `Stylist: ${sb.stylist.name}` : "No Specific Stylist"}
                            </h3>
                            {sb.timeBlocks.map((block, bIdx) => (
                                <div key={bIdx} className="mb-2">
                                    <h4 className="font-semibold mb-1">{block.label}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {block.times.map((t, i) => (
                                            <button
                                                key={i}
                                                onClick={() => openModal(sb.stylist?._id || null, t)}
                                                className="border px-3 py-1 rounded hover:bg-gray-100"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded shadow relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setShowModal(false)}
                        >
                            X
                        </button>
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-bold mb-2">Confirm Time Selection</h2>
                                <p className="mb-4">
                                    You selected <strong>{selectedTime}</strong>
                                    {selectedStylistId
                                        ? " with a specific stylist"
                                        : " with no specific stylist"}
                                    .
                                </p>
                                <button
                                    onClick={handleProceedToPayment}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-bold mb-2">Payment Step</h2>
                                <p className="mb-4">
                                    Transfer to account <strong>5926150385 (Khan Bank)</strong>{" "}
                                    within 5 minutes.
                                    <br />
                                    Timer:{" "}
                                    <span className="font-mono text-red-600">
                    {Math.floor(timer / 60)}:
                                        {(timer % 60).toString().padStart(2, "0")}
                  </span>
                                </p>
                                <button
                                    onClick={handleConfirmPayment}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
