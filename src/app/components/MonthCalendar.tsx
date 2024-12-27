// app/components/MonthCalendar.tsx
"use client";
import React from "react";

interface DayStatus {
    day: number;
    status: "past" | "fullyBooked" | "goingFast" | "available";
}
interface MonthData {
    year: number;
    month: number; // 0=Jan, 11=Dec
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

    const getStatus = (dayNum: number) =>
        days.find((d) => d.day === dayNum)?.status || "available";

    const renderDayCell = (dayNum: number) => {
        const status = getStatus(dayNum);
        const isSelected = dayNum === selectedDay;

        let cellClasses =
            "border h-10 flex items-center justify-center cursor-pointer text-sm";
        if (status === "past") {
            cellClasses += " bg-gray-100 text-gray-400 cursor-not-allowed";
        } else if (status === "fullyBooked") {
            cellClasses += " bg-gray-100 text-red-400 line-through cursor-not-allowed";
        } else {
            // available / goingFast
            cellClasses += " hover:bg-blue-50";
        }

        if (isSelected && status !== "past" && status !== "fullyBooked") {
            cellClasses += " bg-blue-600 text-white hover:bg-blue-600";
        }

        return (
            <div
                key={dayNum}
                className={cellClasses}
                onClick={() => {
                    if (status === "past" || status === "fullyBooked") return;
                    onSelectDay(dayNum);
                }}
            >
                {dayNum}
                {status === "goingFast" && (
                    <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full ml-1" />
                )}
            </div>
        );
    };

    // Build blank cells + day cells
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < dayOfWeekOffset; i++) {
        cells.push(<div key={`blank-${i}`} className="border h-10" />);
    }
    for (let d = 1; d <= totalDays; d++) {
        cells.push(renderDayCell(d));
    }

    const monthName = firstOfMonth.toLocaleString("default", { month: "long" });

    return (
        <div>
            <h2 className="font-bold text-lg mb-2">
                {monthName} {year}
            </h2>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 text-xs font-medium text-center mb-1">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 text-center">{cells}</div>
        </div>
    );
};

export default MonthCalendar;