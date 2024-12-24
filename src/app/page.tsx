// app/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Slider from "../app/components/Slider";
import {
    ScissorsIcon,
    PaintBrushIcon,
    SparklesIcon,
    UserIcon, // Default icon
} from "@heroicons/react/24/solid";

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

    // Minimal icon color
    const getCategoryIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case "hair":
                return <ScissorsIcon className="h-6 w-6 text-gray-600" />;
            case "nails":
                return <PaintBrushIcon className="h-6 w-6 text-gray-600" />;
            case "skin":
                return <SparklesIcon className="h-6 w-6 text-gray-600" />;
            default:
                return <UserIcon className="h-6 w-6 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <p className="p-3 text-center text-gray-500 text-sm">
                Loading categories...
            </p>
        );
    }
    if (error) {
        return (
            <p className="p-3 text-center text-red-500 text-sm">
                {error}
            </p>
        );
    }

    // Minimal slider images
    const sliderImages = [
        "https://dsifg2gm0y83d.cloudfront.net/bundles/assets/images/posing_model_banner.6ede5ab14cd065f47452.png",
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Slider Component */}
            <div className="mb-6">
                <Slider images={sliderImages} />
            </div>

            {/* Intro Text */}
            <p className="mb-6 text-center text-gray-700 text-sm sm:text-base">
                Select a category below to explore our services and book your appointment.
            </p>

            {/* Categories */}
            {categories.length === 0 ? (
                <p className="text-center text-gray-500 text-sm sm:text-base">
                    No categories available at the moment.
                </p>
            ) : (
                <ul className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {categories.map((cat) => (
                        <li
                            key={cat._id}
                            className="flex flex-col items-center border border-gray-200
                         rounded p-4 bg-white hover:bg-gray-50
                         transition-colors"
                        >
                            <Link
                                href={`/categories/${cat._id}/services`}
                                className="flex flex-col items-center w-full h-full
                           focus:outline-none focus:ring-2
                           focus:ring-gray-300"
                                aria-label={`View services for ${cat.name}`}
                            >
                                {/* Icon */}
                                {getCategoryIcon(cat.name)}

                                {/* Name */}
                                <h2 className="mt-2 text-sm sm:text-base font-medium text-gray-800">
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