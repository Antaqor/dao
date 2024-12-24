// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Helper to combine class strings conditionally */
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Orders", href: "/dashboard/orders", icon: "📦" },
        { label: "Services", href: "/dashboard/services", icon: "💇" },
        { label: "Schedule", href: "/dashboard/schedule", icon: "🗓" },
        { label: "Employees", href: "/dashboard/employees", icon: "👥" },
    ];

    return (
        /**
         * For mobile responsiveness, we can show/hide the sidebar with a toggle,
         * but here's a simple approach that always shows on large screens,
         * and is collapsible on small screens via some optional logic.
         */
        <aside className="hidden lg:flex lg:flex-col w-64 h-screen border-r border-gray-200 bg-white">
            {/* Top Section */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="text-xl font-bold">SalonApp</div>
                <div className="text-sm text-gray-500 mt-1">Your Salon Management</div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-4 overflow-y-auto text-sm">
                <ul className="space-y-2">
                    {navItems.map(({ label, href, icon }) => {
                        // highlight the item if pathname starts with href
                        const isActive = pathname?.startsWith(href);
                        return (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className={classNames(
                                        "flex items-center space-x-2 px-3 py-2 rounded font-medium",
                                        isActive
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <span>{icon}</span>
                                    <span>{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Quick Links */}
            <div className="px-6 py-4 border-t border-gray-200 text-sm space-y-2">
                <Link
                    href="/dashboard/create-salon"
                    className="block text-gray-600 hover:text-gray-900"
                >
                    Create/Update Salon
                </Link>
                <Link
                    href="/dashboard/create-service"
                    className="block text-gray-600 hover:text-gray-900"
                >
                    Add Service
                </Link>
                <Link
                    href="/dashboard/create-stylist"
                    className="block text-gray-600 hover:text-gray-900"
                >
                    Add Stylist
                </Link>
                <Link
                    href="/dashboard/create-time-block"
                    className="block text-gray-600 hover:text-gray-900"
                >
                    Add Time Blocks
                </Link>
            </div>
        </aside>
    );
}