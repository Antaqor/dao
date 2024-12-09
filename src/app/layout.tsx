"use client";
import React from 'react';
import { SessionProvider } from "next-auth/react";
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import '../app/globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <html lang="en">
        <body className="bg-gray-100 flex flex-col min-h-screen">
        <SessionProvider>
            <Header /> {/* Header added globally */}
            <main className="flex-grow w-full">
                {children} {/* Children will be replaced by the content of the individual pages */}
            </main>
            <BottomNav/>
        </SessionProvider>
        </body>
        </html>
    );
}