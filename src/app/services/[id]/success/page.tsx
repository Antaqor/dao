"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function SuccessPage() {
    const params = useParams() as { id?: string };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-green-600 mb-4">Order Successful!</h1>
            <p className="mb-4">Thank you. Your booking for Service {params.id} is confirmed!</p>
            <p>We appreciate your business.</p>
        </div>
    );
}