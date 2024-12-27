"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react"; // <-- from NextAuth
import BookingSteps from "../../../components/BookingSteps";

export default function PaymentPage() {
    const router = useRouter();
    const { data: session } = useSession(); // 1) from NextAuth
    const { id } = useParams() as { id?: string };
    const sp = useSearchParams() ?? new URLSearchParams();

    // Info from previous steps
    const date = sp.get("date");
    const time = sp.get("time");
    const stylistId = sp.get("stylist");

    // Display messages to user
    const [message, setMessage] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Show the Bank Transfer modal
    const [showBankModal, setShowBankModal] = useState(false);

    useEffect(() => {
        // If missing essential booking details, warn user
        if (!id || !date || !time) {
            setMessage("Missing required booking details. Please go back.");
        }
    }, [id, date, time]);

    /**
     * Helper to create an appointment on the server
     * using the Bearer token from NextAuth session.
     */
    async function createAppointment() {
        try {
            // 2) Make sure user is logged in (session?.user)
            if (!session?.user) {
                setMessage("Please log in to proceed with payment.");
                return;
            }

            // 3) Our token from NextAuth session
            const token = (session.user as { accessToken?: string })?.accessToken;
            if (!token) {
                setMessage("No token found in session. Please re-login.");
                return;
            }

            // 4) POST to /appointments with Bearer token
            const res = await axios.post(
                "http://localhost:5001/api/appointments",
                {
                    serviceId: id,
                    stylistId: stylistId || null,
                    date,
                    startTime: time,
                    // optionally pass { status: "paid" } if you want to mark it as paid
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 5) On success => show success message
            if (res.status === 201) {
                setMessage("Payment successful! Appointment booked!");
                setBookingSuccess(true);
            } else {
                setMessage("Could not complete booking. Please try again.");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Error completing payment or booking.");
            }
        }
    }

    const handlePayAndBook = async () => {
        await createAppointment();
    };

    const handleOpenBankModal = () => {
        setShowBankModal(true);
    };

    // For bank transfers: after user clicks "Transferred"
    const handleTransferred = async () => {
        setShowBankModal(false);
        await createAppointment();
    };

    // If booking is successful, user can go to Step 4 (Confirmation)
    const goToConfirmation = () => {
        const q = new URLSearchParams({ date: date || "", time: time || "" });
        if (stylistId) q.set("stylist", stylistId);
        router.push(`/services/${id}/confirm?${q.toString()}`);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            {/* Step Indicator: Step 3 */}
            <BookingSteps currentStep={3} />

            <h1 className="text-xl font-bold mb-4">Payment</h1>

            {/* Show any message (errors, success, etc.) */}
            {message && (
                <p className={`mb-4 ${bookingSuccess ? "text-green-700" : "text-red-600"}`}>
                    {message}
                </p>
            )}

            {/* Booking Summary */}
            {(!date || !time) ? (
                <p>Please go back and select a date & time first.</p>
            ) : (
                <div className="mb-4 text-sm text-gray-800">
                    <p><strong>Service ID:</strong> {id}</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time:</strong> {time}</p>
                    <p><strong>Stylist:</strong> {stylistId || "Any Stylist"}</p>
                </div>
            )}

            {/* If booking not done yet, show payment buttons */}
            {!bookingSuccess && (
                <div className="space-y-3">
                    <button
                        onClick={handlePayAndBook}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    >
                        Pay by Card (Simulate)
                    </button>
                    <button
                        onClick={handleOpenBankModal}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded border w-full"
                    >
                        By Bank Account
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-full"
                    >
                        Back
                    </button>
                </div>
            )}

            {/* If booked, show a "Go to Confirmation" button */}
            {bookingSuccess && (
                <div className="mt-4 p-3 border rounded bg-green-50 text-green-700">
                    <button
                        onClick={goToConfirmation}
                        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
                    >
                        Go to Confirmation
                    </button>
                </div>
            )}

            {/* Bank Transfer Modal */}
            {showBankModal && !bookingSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-full max-w-sm rounded shadow-lg relative">
                        <button
                            onClick={() => setShowBankModal(false)}
                            className="absolute top-2 right-2 text-gray-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4">Bank Transfer Details</h3>
                        <p className="text-sm mb-4">
                            <strong>Amount:</strong> (Service fee) <br />
                            <strong>Bank:</strong> Khaan Bank <br />
                            <strong>Account No.:</strong>{" "}
                            <span className="font-mono">59261503085</span>
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            Please transfer the amount to the above account, then click “Transferred.”
                        </p>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={handleTransferred}
                        >
                            Transferred
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}