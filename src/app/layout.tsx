import "./globals.css";
import { Inter } from "next/font/google";
import ClientWrapper from "./components/ClientWrapper";
import Header from "./components/Header";

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
        <body className="min-h-screen bg-white">
        <ClientWrapper>
            {/* Fixed header at the top */}
            <Header />
            {/* Main content in the center, spaced around fixed header & sidebars */}
            <main className="min-h-screen bg-white">
                {children}
            </main>
        </ClientWrapper>
        </body>
        </html>
    );
}
