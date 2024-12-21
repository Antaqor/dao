"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            username,
            password
        });

        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="border p-6 space-y-4">
                <h1 className="text-2xl font-bold">Login</h1>
                {error && <p className="text-red-600">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-4 py-2">Login</button>
            </form>
        </div>
    );
}
