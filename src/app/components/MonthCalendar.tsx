"use client";

import React from "react";

interface MonthCalendarProps {
    year: number;
    month: number; // 0-based (0=Jan, 11=Dec)
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    highlightedDays?: { [day: number]: string };
    // e.g., { 21: 'fast', 22: 'fast', 29: 'fast' } to show a color or dot
}

/**
 * A minimal MonthCalendar that displays a single month
 * and allows selecting a date.
 */
export default function MonthCalendar({
                                          year,
                                          month,
                                          selectedDate,
                                          onSelectDate,
                                          highlightedDays = {},
                                      }: MonthCalendarProps) {
    // Calculate the first and last day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Determine the starting day of the week (0=Sun, 6=Sat)
    const startDay = firstDayOfMonth.getDay();

    // Generate an array of day numbers for the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Get the month's name for display
    const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

    return (
        <div className="p-4">
            <p className="text-lg font-bold text-center">{`${monthName} ${year}`}</p>

            <div className="grid grid-cols-7 gap-2 mt-2 text-center">
                {/* Weekday headers */}
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="font-semibold">
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before the first of the month */}
                {Array.from({ length: startDay }).map((_, index) => (
                    <div key={`empty-${index}`} />
                ))}

                {/* Render each day of the month */}
                {daysArray.map((day) => {
                    const currentDate = new Date(year, month, day);
                    const isSelected =
                        selectedDate?.toDateString() === currentDate.toDateString();
                    const highlight = highlightedDays[day];

                    return (
                        <button
                            key={day}
                            onClick={() => onSelectDate(currentDate)}
                            className={`p-2 border rounded ${
                                isSelected ? "bg-blue-600 text-white" : "bg-white"
                            } hover:bg-gray-100`}
                        >
                            <span className="block">{day}</span>
                            {highlight === 'fast' && (
                                <span className="text-xs text-yellow-500">●</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}