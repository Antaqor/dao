"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Header() {
    const router = useRouter();

    // Controls the visibility of the social media popup
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Ref for the popup menu; used to detect outside clicks (optional)
    const menuRef = useRef<HTMLDivElement>(null);

    // Toggle the menu open/close
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close the menu if user clicks outside of it (optional, for convenience)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                (event.target as Node).nodeName !== "BUTTON"
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <header
                className="
          fixed
          top-0
          left-0
          z-20
          w-full
          h-16
          bg-white
          border-b
          border-gray-200
          flex
          items-center
          justify-between
          px-4
        "
            >
                {/* Left: Profile Skeleton */}
                <div
                    className="
            w-8
            h-8
            bg-gray-200
            rounded-md
            cursor-pointer
            hover:bg-gray-300
            transition
          "
                    onClick={() => router.push("/profile")}
                    aria-label="Profile Placeholder"
                />

                {/* Center: Logo */}
                <Link
                    href="/"
                    className="
            absolute
            left-1/2
            transform
            -translate-x-1/2
          "
                >
                    <span className="text-xl font-bold text-blue-600">Foru</span>
                </Link>

                {/* Right: Burger Menu */}
                <div className="relative">
                    <button
                        onClick={handleMenuToggle}
                        className="
              text-black
              hover:text-gray-600
              transition
              p-2
            "
                        aria-label="Open Menu"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    {/* Popup Menu for Social Links */}
                    {isMenuOpen && (
                        <div
                            ref={menuRef}
                            className="
                absolute
                right-0
                mt-2
                w-40
                bg-white
                border
                border-gray-300
                rounded-md
                shadow-lg
                py-2
                flex
                flex-col
                items-start
                z-50
              "
                        >
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="
                  self-end
                  mr-2
                  text-gray-400
                  hover:text-gray-600
                  transition
                "
                                aria-label="Close Menu"
                            >
                                &times;
                            </button>
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  block
                  w-full
                  px-4
                  py-1
                  text-sm
                  text-gray-700
                  hover:bg-gray-100
                "
                            >
                                Facebook
                            </a>
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  block
                  w-full
                  px-4
                  py-1
                  text-sm
                  text-gray-700
                  hover:bg-gray-100
                "
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.youtube.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  block
                  w-full
                  px-4
                  py-1
                  text-sm
                  text-gray-700
                  hover:bg-gray-100
                "
                            >
                                YouTube
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/*
        Spacer below the header so the main content
        isn't hidden underneath this fixed header.
      */}
            <div className="mt-16" />
        </>
    );
}
