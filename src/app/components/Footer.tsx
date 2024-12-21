"use client";
import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 text-gray-600 py-4 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Vone. All rights reserved.</p>
        </footer>
    );
};

export default Footer;