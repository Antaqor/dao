"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:5001/api/auth/register", {
                username,
                phoneNumber,
                email,
                password,
                role
            });
            if (res.status === 201) {
                alert("Registration successful!");
                router.push("/auth/login");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Registration error");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="border p-6 space-y-4">
                <h1 className="text-2xl font-bold">Register</h1>
                {error && <p className="text-red-600">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 w-full"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    className="border p-2 w-full"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2">
                    Register
                </button>
            </form>
        </div>
    );
}