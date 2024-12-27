"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import BookingSteps from "../../../components/BookingSteps";

// OLD shape: interface OldStylistBlock {
//   stylist?: { _id: string; name: string } | null;
//   timeBlocks: { date: string; label: string; times: string[] }[];
// }
//
// NEW shape: interface NewStylistBlock {
//   stylist?: { _id: string; name: string } | null;
//   times: string[];
// }

interface StylistTimeBlock {
    stylist?: { _id: string; name: string } | null;
    times?: string[]; // optional because older format might not have it
}

const DateChip: React.FC<{
    dateObj: Date;
    isSelected: boolean;
    onClick: () => void;
}> = ({ dateObj, isSelected, onClick }) => {
    const weekday = dateObj.toLocaleDateString(undefined, { weekday: "short" });
    const dayNum = dateObj.getDate();

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-16 h-16 
            border border-gray-300 
            transition-colors duration-200 flex-shrink-0
            ${
                isSelected
                    ? "bg-black text-white border-black"
                    : "bg-white text-black hover:bg-gray-100"
            }
            rounded-md
           `}
        >
            <span className="text-sm font-semibold">{dayNum}</span>
            <span className="text-xs uppercase">{weekday}</span>
        </button>
    );
};

/**
 * Convert "24:00" style times (e.g. "14:45") to "12-hour" format (e.g. "2:45 PM").
 */
function formatTime24To12(time24: string): string {
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert "0" or "12" to "12"
    const minutePadded = minute.toString().padStart(2, "0");

    return `${hour}:${minutePadded} ${ampm}`;
}

/**
 * Group a list of "HH:mm" times into morning, afternoon, and evening.
 */
function groupTimesByTimeOfDay(times: string[] = []) {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    // Define hour ranges
    const morningStart = 7;  // 07:00
    const morningEnd   = 11; // 11:59
    const afternoonStart = 12;
    const afternoonEnd   = 17;
    const eveningStart   = 18;
    const eveningEnd     = 21; // 21:59 (adjust if needed)

    times.forEach((t) => {
        const [hourStr] = t.split(":");
        const hour = parseInt(hourStr, 10);

        if (hour >= morningStart && hour <= morningEnd) {
            morning.push(t);
        } else if (hour >= afternoonStart && hour <= afternoonEnd) {
            afternoon.push(t);
        } else if (hour >= eveningStart && hour <= eveningEnd) {
            evening.push(t);
        }
        // If there's data outside these ranges, you could handle it or ignore it
    });

    return { morning, afternoon, evening };
}

export default function SelectTimePage() {
    const { id } = useParams() as { id?: string };
    const router = useRouter();

    const [dates, setDates] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [stylistBlocks, setStylistBlocks] = useState<StylistTimeBlock[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Which tab is selected: morning, afternoon, or evening
    const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning");

    // Build a small range of dates (today + next 5)
    useEffect(() => {
        const now = new Date();
        const arr: Date[] = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            arr.push(d);
        }
        setDates(arr);
        setSelectedDate(arr[0]);
    }, []);

    // Fetch availability whenever selectedDate changes
    useEffect(() => {
        if (!id || !selectedDate) return;

        const dateStr = selectedDate.toISOString().split("T")[0];
        setLoading(true);

        axios
            .get<any[]>(`http://152.42.243.146/api/services/${id}/availability`, {
                params: { date: dateStr },
            })
            .then((res) => {
                const rawBlocks = res.data;
                // Unify data to ensure we always have .times
                const unifiedBlocks = rawBlocks.map((block) => {
                    if ("timeBlocks" in block && Array.isArray(block.timeBlocks)) {
                        // old format => flatten them
                        const allTimes = block.timeBlocks.flatMap((tb: any) => tb.times || []);
                        return { stylist: block.stylist || null, times: allTimes };
                    } else {
                        // new format => just use "times"
                        return { stylist: block.stylist || null, times: block.times || [] };
                    }
                });

                setStylistBlocks(unifiedBlocks);
                setMessage("");
            })
            .catch((err) => {
                console.error("Failed to load availability:", err);
                setMessage("Could not load availability.");
            })
            .finally(() => setLoading(false));
    }, [id, selectedDate]);

    // Once user picks a time => go to Step 3 (Payment)
    const handleTimeSelect = (stylistId: string | null, time24: string) => {
        if (!selectedDate) return;
        const dateStr = selectedDate.toISOString().split("T")[0];
        const q = new URLSearchParams({ date: dateStr, time: time24 });
        if (stylistId) q.set("stylist", stylistId);
        router.push(`/services/${id}/payment?${q.toString()}`);
    };

    // Scroll handlers for the horizontal date scroller
    const scrollLeft = () => {
        document.getElementById("dateScroller")?.scrollBy({ left: -100, behavior: "smooth" });
    };
    const scrollRight = () => {
        document.getElementById("dateScroller")?.scrollBy({ left: 100, behavior: "smooth" });
    };

    // Renders the three time-of-day tabs
    const renderTimeOfDayTabs = () => {
        const tabs: { key: "morning" | "afternoon" | "evening"; label: string }[] = [
            { key: "morning", label: "Morning" },
            { key: "afternoon", label: "Afternoon" },
            { key: "evening", label: "Evening" },
        ];

        return (
            <div className="flex space-x-2">
                {tabs.map((tab) => {
                    const isActive = timeOfDay === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setTimeOfDay(tab.key)}
                            className={`px-4 py-2 rounded-md border 
                transition-colors duration-200
                ${
                                isActive
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            {/* Step Indicator: Step 2 */}
            <BookingSteps currentStep={2} />

            <h1 className="text-2xl font-bold">Select a time</h1>
            <p className="text-gray-700">Choose a date and time for your appointment.</p>

            {/* Horizontal date scroller */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={scrollLeft}
                    className="h-10 w-10 rounded-md border text-gray-600 hover:bg-gray-100 hidden md:flex items-center justify-center"
                    aria-label="Scroll Left"
                >
                    &larr;
                </button>
                <div
                    id="dateScroller"
                    className="flex space-x-3 overflow-x-auto pb-2 flex-1 scrollbar-hide"
                >
                    {dates.map((d) => {
                        const isSelected = selectedDate?.toDateString() === d.toDateString();
                        return (
                            <DateChip
                                key={d.toISOString()}
                                dateObj={d}
                                isSelected={isSelected}
                                onClick={() => setSelectedDate(d)}
                            />
                        );
                    })}
                </div>
                <button
                    onClick={scrollRight}
                    className="h-10 w-10 rounded-md border text-gray-600 hover:bg-gray-100 hidden md:flex items-center justify-center"
                    aria-label="Scroll Right"
                >
                    &rarr;
                </button>
            </div>

            {loading && <p>Loading times...</p>}
            {message && <p className="text-red-600">{message}</p>}

            {/* Time-of-day Tabs */}
            {renderTimeOfDayTabs()}

            {/* Availability */}
            {!loading && stylistBlocks.length === 0 ? (
                <p className="text-gray-600">No availability found for this date.</p>
            ) : (
                stylistBlocks.map((sb, idx) => {
                    // 1) Sort times if needed, so they appear in ascending order
                    const sortedTimes = (sb.times || []).slice().sort();

                    // 2) Group them into morning/afternoon/evening
                    const { morning, afternoon, evening } = groupTimesByTimeOfDay(sortedTimes);

                    // 3) Based on the current tab, decide which times to show
                    let timesToShow: string[] = [];
                    if (timeOfDay === "morning")   timesToShow = morning;
                    if (timeOfDay === "afternoon") timesToShow = afternoon;
                    if (timeOfDay === "evening")   timesToShow = evening;

                    return (
                        <div key={idx} className="border p-4 rounded-md bg-white shadow-sm mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {sb.stylist ? `Stylist: ${sb.stylist.name}` : "Any Stylist"}
                            </h3>

                            {timesToShow.length === 0 ? (
                                <p className="text-gray-500 italic">
                                    No {timeOfDay} times available.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {timesToShow.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => handleTimeSelect(sb.stylist?._id || null, t)}
                                            className="
      flex items-center justify-start
      w-full px-4 py-3
      border border-gray-300
      rounded-md
      hover:bg-gray-100
      transition-colors duration-150
      text-left
    "
                                        >
                                            {/* The green dot */}
                                            <span
                                                className="inline-block w-2 h-2 rounded-full bg-green-500 mr-3"
                                                aria-hidden="true"
                                            ></span>

                                            {/* The time (24->12 format) */}
                                            <span className="text-blue-600 font-semibold text-lg">
      {formatTime24To12(t)}
    </span>
                                        </button>
                                    ))}

                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
