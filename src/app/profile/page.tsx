"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../lib/auth";

export default function UserProfilePage() {
    const [userData, setUserData] = useState<{ username: string; phoneNumber: string } | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setError("Not authenticated. Please log in.");
            return;
        }

        axios
            .get("http://68.183.191.149/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUserData(res.data);
            })
            .catch((err) => {
                console.error("Profile fetch error:", err);
                setError(err.response?.data?.error || "Error fetching user profile.");
            });
    }, []);

    if (error) {
        return <div>{error}</div>;
    }
    if (!userData) {
        return <div>Loading user profile...</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <p>Username: {userData.username}</p>
            <p>Phone Number: {userData.phoneNumber}</p>
        </div>
    );
}
