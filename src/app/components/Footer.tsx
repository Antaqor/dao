// src/app/components/Footer.tsx
"use client";
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white text-gray-800 py-6 mt-10">
            <div className="container mx-auto text-center">
                <p>© 2024 Vone DAO. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#home" className="hover:text-gray-600">Home</a>
                    <a href="#faq" className="hover:text-gray-600">FAQ</a>
                    <a href="#twitter" className="hover:text-gray-600">Twitter</a>
                    <a href="#facebook" className="hover:text-gray-600">Facebook</a>
                </div>
                <p className="mt-4 text-sm">
                    <a href="#privacy" className="hover:text-gray-600">Privacy Policy</a> • <a href="#terms" className="hover:text-gray-600">Terms of Service</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;