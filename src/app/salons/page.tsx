"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

/** Basic shape of a Salon. Adjust if your backend differs. */
interface Salon {
    _id: string;
    name: string;
    location: string;
}

export default function SalonsPage() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch salons on mount
    useEffect(() => {
        const fetchSalons = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await axios.get("http://152.42.243.146:5001/api/salons");
                setSalons(res.data);
                setFilteredSalons(res.data); // initialize filtered list
            } catch (err) {
                console.error("Error fetching salons:", err);
                setError("Failed to fetch salons. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalons();
    }, []);

    /**
     * Handle user typing in the search bar.
     * Filter salons by matching the `name` or `location`.
     */
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (!term.trim()) {
            // If empty, reset
            setFilteredSalons(salons);
            return;
        }

        // Case-insensitive filter on name + location
        const lowerTerm = term.toLowerCase();
        const results = salons.filter(
            (salon) =>
                salon.name.toLowerCase().includes(lowerTerm) ||
                salon.location.toLowerCase().includes(lowerTerm)
        );
        setFilteredSalons(results);
    };

    // If there's an error, show it and bail out
    if (error) {
        return <p className="p-4 text-red-600">{error}</p>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">All Salons</h1>

            {/* Search bar (optional). Remove if not needed. */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search salons by name or location..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loading state: show a few skeleton cards or a text. */}
            {loading && (
                <div className="space-y-4">
                    <SalonSkeleton />
                    <SalonSkeleton />
                    <SalonSkeleton />
                </div>
            )}

            {/* No salons found (when not loading and the list is empty). */}
            {!loading && filteredSalons.length === 0 && (
                <p className="text-gray-500">No salons found.</p>
            )}

            {/* Salon list in a responsive grid. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSalons.map((salon) => (
                    <div
                        key={salon._id}
                        className="border border-gray-100 p-4 rounded shadow-sm bg-white flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-lg font-semibold mb-1">{salon.name}</h2>
                            <p className="text-sm text-gray-600">{salon.location}</p>
                        </div>
                        <div className="mt-4">
                            <Link
                                href={`/salons/${salon._id}`}
                                className="inline-block w-full text-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                            >
                                View Services
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * A simple skeleton "card" to show while data is loading.
 * Feel free to replace with a more elaborate skeleton or spinner.
 */
function SalonSkeleton() {
    return (
        <div className="animate-pulse border border-gray-200 rounded p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
    );
}