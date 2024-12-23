// app/layout.tsx

"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Header from "./components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="font-sans bg-white text-black">
        <SessionProvider>
            <Header />
            <main className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </SessionProvider>
        </body>
        </html>
    );
}