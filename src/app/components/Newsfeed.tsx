// src/app/components/Newsfeed.tsx

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    user?: {
        _id: string;
        username: string;
        verified?: boolean;
    };
    engagement?: {
        likes: number;
        comments: number;
    };
}

const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}m`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m`;

    return `${Math.floor(seconds)}s`;
};

const Newsfeed: React.FC = () => {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://152.42.243.146:5001";

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch(`${backendUrl}/api/posts`, { credentials: "include" });
            if (!res.ok) throw new Error(`Error fetching posts: ${res.status}`);
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error("Failed to load posts:", err);
            setError("Failed to load posts.");
        }
    }, [backendUrl]);

    const createPost = async () => {
        if (!content.trim()) return;

        try {
            const res = await fetch(`${backendUrl}/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error(`Error creating post: ${res.status}`);
            const data = await res.json();
            setPosts((prev) => [data.post, ...prev]);
            setContent("");
        } catch (err) {
            console.error("Failed to create post:", err);
            setError("Failed to create post.");
        }
    };

    useEffect(() => {
        if (status === "authenticated") fetchPosts();
    }, [status, fetchPosts]);

    return (
        <div className="flex flex-col items-center bg-black w-full">
            <div className="w-full px-4 pb-20">
                {/* Post Input */}
                <div className="bg-black p-4 border-b border-gray-700">
          <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's new?"
              className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 resize-none"
              rows={3}
          />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={createPost}
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Post
                        </button>
                    </div>
                    {error && (
                        <div className="text-red-400 bg-red-900 p-2 mt-2 rounded">
                            {error}
                        </div>
                    )}
                </div>

                {/* Posts Section */}
                {posts.length > 0 ? (
                    <div className="divide-y divide-gray-700">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-black p-4">
                                {/* User Info */}
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-gray-400 text-xs">{getTimeAgo(new Date(post.createdAt))}</p>
                                    <p className="text-white text-sm font-medium">{post.user?.username || "Anonymous"}</p>
                                </div>

                                {/* Post Content */}
                                <h3 className="text-base text-white font-semibold mb-1">{post.title}</h3>
                                <p className="text-gray-300 text-sm">{post.content}</p>

                                {/* Engagement */}
                                <div className="flex items-center space-x-4 mt-3 text-gray-400">
                                    <button className="flex items-center space-x-1 hover:text-red-500">
                                        <HeartIcon className="h-5 w-5" />
                                        <span>{post.engagement?.likes || 0}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 hover:text-green-500">
                                        <ChatBubbleLeftIcon className="h-5 w-5" />
                                        <span>{post.engagement?.comments || 0}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center mt-4">No posts available. Create one!</p>
                )}
            </div>
        </div>
    );
};

export default Newsfeed;