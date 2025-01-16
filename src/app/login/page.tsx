// File: /app/login/page.tsx

"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Call your Express backend
            const res = await axios.post("http://localhost:5001/api/auth/login", {
                username,
                password,
            });

            // If success, store both user & token in context
            if (res.status === 200 && res.data.token) {
                // Embedding the token into the user object:
                const newUser = { ...res.data.user, accessToken: res.data.token };

                // Now pass user + token to context login()
                login(newUser, res.data.token);

                // Then navigate somewhere, e.g. home
                router.push("/");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid credentials or server error.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 px-4">
            <h1 className="text-3xl font-semibold mb-8 text-center tracking-wide">
                Login
            </h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col space-y-6"
            >
                {error && <p className="text-red-500 text-center font-medium">{error}</p>}

                <div className="flex flex-col">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        className="rounded-lg bg-gray-100 border-0 p-3"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="rounded-lg bg-gray-100 border-0 p-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-neutral-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
