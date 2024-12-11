// app/layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import "../app/globals.css";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}): JSX.Element {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // Check on mount

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile === null) {
        // Render nothing or a loader while determining
        return (
            <html lang="en" className="bg-black font-sans">
            <body className="bg-black flex items-center justify-center min-h-screen">
            <p className="text-white text-xl">Loading...</p>
            </body>
            </html>
        );
    }

    return (
        <html lang="en" className="bg-black font-sans">
        <body className="bg-black">
        <SessionProvider>
            {isMobile ? (
                <>
                    <Header /> {/* Header added globally */}
                    <main className="flex-grow w-full">
                        {children} {/* Page content */}
                    </main>
                    <BottomNav /> {/* Bottom navigation */}
                </>
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-white text-xl">
                        This website is for mobile users only.
                    </p>
                </div>
            )}
        </SessionProvider>
        </body>
        </html>
    );
}