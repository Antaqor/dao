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
            <main>{children}</main>
        </SessionProvider>
        </body>
        </html>
    );
}