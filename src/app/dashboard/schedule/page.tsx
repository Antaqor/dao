// app/dashboard/schedule/page.tsx
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/app/components/Sidebar";
import MinimalTabs from "@/app/components/MinimalTabs";

export default function SchedulePage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user || session.user.role !== "owner") {
        return <p>You must be an owner to view this page.</p>;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
                <MinimalTabs />
                <h1 className="text-2xl font-bold mb-4">Schedule</h1>
                <p className="text-gray-500">
                    In development—visualize your time blocks here.
                </p>
            </main>
        </div>
    );
}