"use client";

import React, { useEffect, useState } from "react";

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

const TestBackendPage = () => {
    const [posts, setPosts] = useState<Post[]>([]); // State to store fetched posts
    const [error, setError] = useState<string | null>(null); // State to handle errors

    // Fetch posts from backend
    const fetchPosts = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/posts"); // Replace with your backend URL
            if (!res.ok) {
                throw new Error(`Failed to fetch posts: ${res.status}`);
            }
            const data = await res.json();
            setPosts(data); // Store posts in state
            setError(null); // Clear any previous errors
        } catch (err: any) {
            setError(err.message || "Something went wrong!");
            setPosts([]); // Clear posts on error
        }
    };

    // Fetch posts on page load
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Fetch Posts</h1>

                {/* Show error message */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Show posts */}
                {posts.length > 0 ? (
                    <ul className="space-y-4">
                        {posts.map((post) => (
                            <li key={post._id} className="bg-gray-100 p-4 rounded shadow">
                                <h2 className="text-xl font-semibold">{post.title}</h2>
                                <p className="text-gray-700 mt-2">{post.content}</p>
                                <p className="text-sm text-gray-500 mt-4">
                                    Created At: {new Date(post.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-700 text-center">No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default TestBackendPage;