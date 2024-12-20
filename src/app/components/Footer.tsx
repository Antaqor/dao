// src/app/components/Footer.tsx

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 py-6">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Beauty Booking Platform. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link href="/about" className="hover:underline">
                        About
                    </Link>
                    <Link href="/contact" className="hover:underline">
                        Contactt
                    </Link>
                    <Link href="/privacy" className="hover:underline">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;