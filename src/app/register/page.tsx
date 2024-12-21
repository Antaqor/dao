"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// Interface for the registration response
interface RegisterResponse {
    message: string;
    // Add other response fields if necessary
}

// Interface for the error response
interface ErrorResponse {
    error: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("user");
    const [error, setError] = useState<string>("");

    // Handle form submission for user registration
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post<RegisterResponse>(
                "http://152.42.243.146:5001/api/auth/register",
                {
                    username,
                    phoneNumber,
                    email,
                    password,
                    role
                }
            );

            if (response.status === 201) {
                alert("Registration successful!");
                router.push("/auth/login");
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                setError(axiosError.response?.data.error || "Registration error.");
            } else {
                setError("An unexpected error occurred.");
            }
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="border p-6 space-y-4 bg-white rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center">Register</h1>
                {error && <p className="text-red-600 text-center">{error}</p>}

                <div>
                    <label htmlFor="username" className="block font-semibold mb-1">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        className="border p-2 w-full rounded"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phoneNumber" className="block font-semibold mb-1">Phone Number</label>
                    <input
                        id="phoneNumber"
                        type="text"
                        placeholder="Phone Number"
                        className="border p-2 w-full rounded"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="border p-2 w-full rounded"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block font-semibold mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="border p-2 w-full rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block font-semibold mb-1">Role</label>
                    <select
                        id="role"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700 transition-colors"
                >
                    Register
                </button>
            </form>
        </div>
    );
}