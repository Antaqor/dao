"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import BookingSteps from "../../../components/BookingSteps";


export default function ConfirmationPage() {
    const { id } = useParams() as { id?: string };
    const sp = useSearchParams() ?? new URLSearchParams();

    const date = sp.get("date");
    const time = sp.get("time");
    const stylist = sp.get("stylist");

    return (
        <div className="p-4 max-w-md mx-auto">
            {/* Step Indicator: Step 4 */}
            <BookingSteps currentStep={4} />

            <h1 className="text-2xl font-bold text-green-700 mb-4">
                Your Booking is Confirmed!
            </h1>
            <p className="text-gray-700 mb-4">
                Thank you for your order. Below are your booking details:
            </p>
            <ul className="list-disc ml-5 text-sm text-gray-800 mb-4">
                <li><strong>Service ID:</strong> {id}</li>
                <li><strong>Date:</strong> {date}</li>
                <li><strong>Time:</strong> {time}</li>
                <li><strong>Stylist:</strong> {stylist || "Any Stylist"}</li>
            </ul>
            <p className="text-gray-500">We look forward to seeing you soon!</p>
        </div>
    );
}