// File: /app/register/page.tsx
"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface RegisterResponse {
    message: string;
}
interface ErrorResponse {
    error: string;
}

export default function UserRegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post<RegisterResponse>(
                "http://68.183.191.149/api/auth/register",
                {
                    username,
                    phoneNumber,
                    email,
                    password,
                    role: "user",
                }
            );
            if (response.status === 201) {
                alert("User registration successful!");
                router.push("/login");
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ErrorResponse>;
                setError(axiosError.response?.data.error || "Registration error.");
            } else {
                setError("Unknown error occurred.");
            }
            console.error("Registration error:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col space-y-6"
            >
                {error && <p className="text-red-500 text-center font-medium">{error}</p>}

                <div className="flex flex-col">
                    <label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700 mb-2"
                    >
                        Хэрэглэгчийн нэр
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="rounded-lg bg-gray-100 border-0 p-3"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* More fields... */}
                <button
                    type="submit"
                    className="bg-neutral-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                    Бүртгэл үүсгэх
                </button>
            </form>
        </div>
    );
}
