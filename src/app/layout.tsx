// File: /app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import AdaptiveUserInterface from "./AdaptiveUserInterface";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Salon Booking System",
    description: "A next-generation scheduling and booking platform",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`min-h-screen bg-gray-50 ${inter.className}`}>
        {/* <AuthProvider> so entire app can read auth context */}
        <AuthProvider>
            <AdaptiveUserInterface>{children}</AdaptiveUserInterface>
        </AuthProvider>
        </body>
        </html>
    );
}
