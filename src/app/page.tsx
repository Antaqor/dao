// app/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Slider from "../app/components/Slider"; // Adjust the path if necessary
import {
    ScissorsIcon,
    PaintBrushIcon,
    SparklesIcon,
    UserIcon, // Default icon
} from "@heroicons/react/24/solid"; // Importing solid icons

interface Category {
    _id: string;
    name: string;
    subServices: string[];
}

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // Fetch categories for homepage
                const res = await axios.get("http://152.42.243.146:5001/api/categories");
                setCategories(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch categories.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Helper function to select icon based on category name
    const getCategoryIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case "hair":
                return <ScissorsIcon className="h-6 w-6 text-blue-600" />;
            case "nails":
                return <PaintBrushIcon className="h-6 w-6 text-blue-600" />;
            case "skin":
                return <SparklesIcon className="h-6 w-6 text-blue-600" />;
            // Add more cases as needed
            default:
                return <UserIcon className="h-6 w-6 text-blue-600" />; // Default smaller icon
        }
    };

    if (loading)
        return (
            <p className="p-2 text-center text-blue-600 text-sm">Loading categories...</p>
        );
    if (error)
        return (
            <p className="p-2 text-center text-red-600 text-sm">{error}</p>
        );

    // Slider Images Array
    const sliderImages = [
        "https://dsifg2gm0y83d.cloudfront.net/bundles/assets/images/posing_model_banner.6ede5ab14cd065f47452.png",
        // Add more image URLs here as needed
    ];

    return (
        <div className="p-2 sm:p-4">
            {/* Slider Component */}
            <Slider images={sliderImages} />

            {/* Spacer */}
            <div className="my-4 sm:my-6"></div>
            <p className="mb-4 sm:mb-6 text-center text-gray-700 text-sm sm:text-base">
                Select a category below to explore our services and book your appointment.
            </p>
            {categories.length === 0 ? (
                <p className="text-center text-gray-500 text-sm sm:text-base">
                    No categories available at the moment.
                </p>
            ) : (
                <ul className="grid gap-4 sm:gap-6 grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
                    {categories.map((cat) => (
                        <li
                            key={cat._id}
                            className="flex flex-col items-center border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Entire Card is Clickable */}
                            <Link
                                href={`/categories/${cat._id}/services`}
                                className="flex flex-col items-center w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={`View services for ${cat.name}`}
                            >
                                {/* Category Icon */}
                                {getCategoryIcon(cat.name)}

                                {/* Category Name */}
                                <h2 className="text-sm sm:text-base font-semibold text-gray-800 mt-2 mb-1 text-center">
                                    {cat.name}
                                </h2>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}