// src/app/layout.tsx

"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "../app/globals.css";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <html lang="en">
        <body className="font-sans bg-white text-black">
        <SessionProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow p-4">
                    {children}
                </main>
                <Footer />
            </div>
        </SessionProvider>
        </body>
        </html>
    );
}