// src/app/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {/* Section 1 */}
                <div>
                    <h2 className="text-xl font-bold mb-4">The Wolves</h2>
                </div>
                {/* Section 2 */}
                <div>
                    <h2 className="text-xl font-bold mb-4">General</h2>
                    <ul>
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/faq" className="hover:underline">FAQ</a></li>
                    </ul>
                </div>
                {/* Section 3 */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Social</h2>
                    <ul>
                        <li><a href="https://twitter.com" target="_blank" className="hover:underline" rel="noreferrer">Twitter</a></li>
                        <li><a href="https://facebook.com" target="_blank" className="hover:underline" rel="noreferrer">Facebook</a></li>
                        <li><a href="https://discord.com" target="_blank" className="hover:underline" rel="noreferrer">Discord</a></li>
                        <li><a href="https://telegram.org" target="_blank" className="hover:underline" rel="noreferrer">Telegram</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto text-center mt-10">
                <p className="text-sm">&copy; The Wolves Community © 2024 All rights reserved</p>
                <p className="text-sm mt-2">
                    <a href="/privacy-policy" className="hover:underline">Privacy Policy</a> &bull; <a href="/terms" className="hover:underline">Terms of Service</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
