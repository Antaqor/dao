"use client";
import React from "react";

interface DayStatus {
    day: number;
    status: string; // "past" | "fullyBooked" | "goingFast" | "available"
}

interface MonthData {
    year: number;
    month: number; // 0-based (0=Jan, 11=Dec)
    days: DayStatus[];
}

interface MonthCalendarProps {
    data: MonthData;
    selectedDay: number | null;
    onSelectDay: (day: number) => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
                                                         data,
                                                         selectedDay,
                                                         onSelectDay,
                                                     }) => {
    const { year, month, days } = data;

    const firstOfMonth = new Date(year, month, 1);
    const dayOfWeekOffset = firstOfMonth.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const monthName = firstOfMonth.toLocaleString("default", { month: "long" });

    // Find a day's status
    const getStatus = (day: number) => {
        const found = days.find((d) => d.day === day);
        return found?.status || "available";
    };

    // Render a single day cell
    const renderDayCell = (day: number) => {
        const status = getStatus(day);
        const isSelected = day === selectedDay;

        let cellClasses = "border h-10 flex items-center justify-center cursor-pointer";
        let labelClasses = "";
        let dotColor = "";

        if (status === "past") {
            cellClasses += " bg-gray-200 text-gray-400 cursor-not-allowed";
        } else if (status === "fullyBooked") {
            cellClasses += " bg-gray-100 text-gray-400 line-through";
            labelClasses = "line-through";
        } else if (status === "goingFast") {
            dotColor = "bg-yellow-400 inline-block w-2 h-2 rounded-full ml-1";
            cellClasses += " hover:bg-blue-50";
        } else {
            // "available"
            cellClasses += " hover:bg-blue-50";
        }

        if (isSelected && status !== "past" && status !== "fullyBooked") {
            cellClasses += " bg-blue-600 text-white hover:bg-blue-600";
        }

        return (
            <div
                key={day}
                className={cellClasses}
                onClick={() => {
                    if (status === "past" || status === "fullyBooked") return;
                    onSelectDay(day);
                }}
            >
                <span className={labelClasses}>{day}</span>
                {status === "goingFast" && <span className={dotColor} />}
            </div>
        );
    };

    // Build the array of day cells
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < dayOfWeekOffset; i++) {
        cells.push(<div key={`blank-${i}`} className="border h-10" />);
    }
    for (let d = 1; d <= totalDays; d++) {
        cells.push(renderDayCell(d));
    }

    return (
        <div className="mb-4">
            {/* Title row */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">
                    {monthName} {year}
                </h2>
                {/* Optional: add previous/next buttons */}
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 text-center mb-1 font-semibold">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 text-center">
                {cells}
            </div>
        </div>
    );
};

export default MonthCalendar;