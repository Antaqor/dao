// File: /app/AdaptiveUserInterface.tsx
"use client";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

const MOBILE_BREAKPOINT = 768;

interface AdaptiveUserInterfaceProps {
    children: React.ReactNode;
}

export default function AdaptiveUserInterface({ children }: AdaptiveUserInterfaceProps) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        updateIsMobile(); // initial check on mount

        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);

    if (isMobile === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-xl text-gray-700">Loading...</p>
            </div>
        );
    }

    return (
        <section>
            <Header />
            <main className="w-full flex-grow">{children}</main>
            {isMobile && <BottomNav />}
        </section>
    );
}
