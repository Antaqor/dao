// src/components/Register.tsx
"use client";
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ErrorResponse {
    error: string;
}

const Register = () => {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://152.42.243.146:5001';

        try {
            const response = await axios.post(`${backendUrl}/api/auth/register`, {
                username,
                phoneNumber,
                password,
                email,
            });

            if (response.status === 201) {
                alert('Registration successful!');
                router.push('/auth/login');
            }
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            if (err.response && err.response.data) {
                console.error('Error registering user:', err.response.data);
                alert('Registration failed: ' + err.response.data.error);
            } else {
                console.error('Unexpected error:', error);
                alert('Registration failed: An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Нэр
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Утасны дугаар
                        </label>
                        <input
                            id="phoneNumber"
                            type="text"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Нууц үг
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Нууц үг"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 transition duration-300"
                    >
                        Үрэгжлүүлэх
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;