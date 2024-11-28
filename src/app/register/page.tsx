"use client";

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Define a type for the expected error response
interface ErrorResponse {
    error: string; // Adjust this according to your API's error structure
}

const Register = () => {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // Error state for better user feedback
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    // Hardcoded backend API URL
    const backendUrl = 'http://152.42.243.146:5000';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        // Validate input fields
        if (!username.trim() || !phoneNumber.trim() || !password.trim()) {
            setError('Бүх талбарыг бөглөнө үү');
            return;
        }

        if (password.length < 6) {
            setError('Нууц үг хамгийн багадаа 6 тэмдэгтээс бүрдсэн байх ёстой.');
            return;
        }

        setLoading(true);

        try {
            // Send POST request to the hardcoded backend API
            const response = await axios.post(`${backendUrl}/api/auth/register`, {
                username,
                phoneNumber,
                password,
            });

            if (response.status === 201) {
                alert('Бүртгэл амжилттай хийгдлээ!');
                router.push('/login'); // Redirect to login page
            }
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>; // Explicitly type the Axios error
            if (err.response && err.response.data) {
                console.error('Error registering user:', err.response.data);
                setError(err.response.data.error || 'Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу.');
            } else {
                console.error('Unexpected error:', error);
                setError('Бүртгэл амжилтгүй боллоо. Техникийн алдаа гарлаа.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Бүртгүүлэх</h1>
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                            aria-label="Enter your username"
                        >
                            Нэр
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Нэр"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                            aria-label="Enter your phone number"
                        >
                            Утасны дугаар
                        </label>
                        <input
                            id="phoneNumber"
                            type="text"
                            placeholder="Утасны дугаар"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                            aria-label="Enter your password"
                        >
                            Нууц үг
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Нууц үг"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-md text-white font-semibold ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        } transition duration-300`}
                    >
                        {loading ? 'Бүртгүүлж байна...' : 'Үргэлжлүүлэх'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Бүртгэлтэй юу?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Нэвтрэх
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;