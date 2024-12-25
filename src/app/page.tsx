"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import {
    PaintBrushIcon,
    SparklesIcon,
    HandRaisedIcon,
    FaceSmileIcon,
    StarIcon,           // <-- Import stylish star icon
} from "@heroicons/react/24/solid";

interface Category {
    _id: string;
    name: string;
    subServices: string[];
}

interface Service {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
    salon?: {
        _id: string;
        name: string;
    };
    category?: string | { _id: string };
}

/** Returns a vibrant icon based on category name. */
function getVibrantIcon(name: string) {
    switch (name.toLowerCase()) {
        case "hair":
            return <PaintBrushIcon className="h-5 w-5 text-pink-600" />;
        case "nail":
        case "nails":
            return <HandRaisedIcon className="h-5 w-5 text-emerald-600" />;
        case "beauty":
        case "skin":
            return <SparklesIcon className="h-5 w-5 text-purple-600" />;
        default:
            return <FaceSmileIcon className="h-5 w-5 text-blue-600" />;
    }
}

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch categories & services
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError("");
                setLoading(true);

                // 1) Fetch categories
                const catRes = await axios.get<Category[]>("http://152.42.243.146:5001/api/categories");
                const fetchedCats = catRes.data;
                setCategories(fetchedCats);

                // 2) Fetch services
                const srvRes = await axios.get<Service[]>("http://152.42.243.146:5001/api/services");
                setServices(srvRes.data);

                // 3) Auto-select "Hair" if it exists
                const defaultHair = fetchedCats.find((cat) => cat.name.toLowerCase() === "hair");
                if (defaultHair) {
                    setSelectedCategoryId(defaultHair._id);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err instanceof AxiosError) {
                    console.error("Axios details:", err.response?.data || err.message);
                }
                setError("Failed to load categories or services.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter displayed services if a category is selected
    const displayedServices = selectedCategoryId
        ? services.filter((svc) => {
            if (typeof svc.category === "string") {
                return svc.category === selectedCategoryId;
            } else if (svc.category && typeof svc.category === "object") {
                return svc.category._id === selectedCategoryId;
            }
            return false;
        })
        : [];

    if (error) {
        return (
            <p className="p-4 text-center text-red-600 text-sm sm:text-base">
                {error}
            </p>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {loading && <p className="text-gray-500 mb-4">Loading...</p>}

            {/* Categories as "chips" */}
            {!loading && categories.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                    {categories.map((cat) => {
                        const isSelected = selectedCategoryId === cat._id;
                        return (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategoryId(isSelected ? null : cat._id)}
                                className={`group inline-flex items-center space-x-2
                  border rounded-full px-4 py-2 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-gray-300
                  ${
                                    isSelected
                                        ? "bg-gray-200 border-gray-300"
                                        : "border-gray-300 hover:bg-gray-100"
                                }
                `}
                            >
                                <span>{getVibrantIcon(cat.name)}</span>
                                <span className="text-sm sm:text-base text-black group-hover:text-black">
                  {cat.name}
                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Show services if a category is chosen */}
            {selectedCategoryId && (
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        Services for{" "}
                        {categories.find((c) => c._id === selectedCategoryId)?.name || "Selected Category"}
                    </h2>

                    {displayedServices.length === 0 ? (
                        <p className="text-gray-500">No services found in this category.</p>
                    ) : (
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {displayedServices.map((srv) => (
                                <Link key={srv._id} href={`/services/${srv._id}`} className="block">
                                    <li className="border p-4 rounded shadow hover:shadow-md transition-shadow cursor-pointer">
                                        {/* Top row: name (left) + rating (right) */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">{srv.name}</h3>

                                            {/* Rating top-right */}
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-gray-500 mb-0.5">Үнэлгээ</span>
                                                <div className="flex text-black space-x-1">
                                                    <StarIcon className="h-4 w-4" />
                                                    <StarIcon className="h-4 w-4" />
                                                    <StarIcon className="h-4 w-4" />
                                                    <StarIcon className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Second row: salon (left), price/time (right) */}
                                        <div className="flex justify-between items-center mt-2">
                                            {srv.salon ? (
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {srv.salon.name}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-400">No salon</p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                ${srv.price} / {srv.durationMinutes}m
                                            </p>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}