import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import logo from '../img/logo.svg';
import Image from 'next/image';

const Header: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <header className="bg-black text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-6 py-3">
                {/* Logo */}
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push('/')}
                >
                    <Image src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                    <span className="ml-3 font-bold text-lg">Vone</span>
                </div>
            </div>
        </header>
    );
};

export default Header;