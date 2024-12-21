"use client";
import React, { useState } from "react";

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
    // Calculate the days in the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // dayOfWeek = 0 (Sun) through 6 (Sat)
    const startDay = firstDayOfMonth.getDay();

    // Create an array to hold day numbers, and we will offset them by startDay
    const daysArray = [...Array(daysInMonth)].map((_, i) => i + 1);

    // We'll show the month name
    const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

    return (
        <div>
            <p className="text-lg font-bold text-center">{monthName} {year}</p>

            <div className="grid grid-cols-7 gap-2 mt-2 text-center">
                {/* Weekday headings */}
                {["S", "M", "T", "W", "T", "F", "S"].map((w) => (
                    <div key={w} className="font-semibold">{w}</div>
                ))}

                {/* Blank spaces before the first day */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`blank-${i}`} />
                ))}

                {/* Actual days */}
                {daysArray.map((day) => {
                    const dateObj = new Date(year, month, day);
                    const isSelected = selectedDate
                        && dateObj.toDateString() === selectedDate.toDateString();

                    // if day in highlightedDays, we mark it
                    const highlight = highlightedDays[day];

                    return (
                        <button
                            key={day}
                            onClick={() => onSelectDate(dateObj)}
                            className={`p-2 border rounded ${
                                isSelected ? "bg-blue-600 text-white" : "bg-white"
                            }`}
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