// app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClientWrapper from "./components/ClientWrapper";

// Example: using Google’s Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Salon Booking App",
    description: "Modern salon booking system",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.className}>
        <body className="min-h-screen flex flex-col">
        {/* Wrap with Next-Auth session provider */}
        <ClientWrapper>
            {/* Sticky/Fixed Header */}
            <Header />

            {/* Main content area */}
            <main className="flex-1 pt-16 bg-gray-50">
                {/*
              The pt-16 offsets the fixed header height.
              If your Header is 4rem, you can match that with pt-16
            */}
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </ClientWrapper>
        </body>
        </html>
    );
}