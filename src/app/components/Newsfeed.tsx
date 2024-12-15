"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

interface Post {
    _id: string;
    content: string;
    createdAt: string;
    user?: { _id: string; username: string };
    engagement?: { likes: number; comments: number };
    comments?: Comment[];
    isLiked: boolean;
}

interface Comment {
    _id?: string;
    content: string;
    user: { username: string };
}

const Newsfeed: React.FC = () => {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [wordCount, setWordCount] = useState<number>(0);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch(`${backendUrl}/api/posts`, {
                headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error("Failed to load posts:", err);
        }
    }, [backendUrl, session?.user?.accessToken]);

    const createPost = async () => {
        if (!newPostContent.trim() || wordCount > 150) {
            setError("Content cannot exceed 150 words.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                },
                body: JSON.stringify({ content: newPostContent }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to create post");

            const newPost = {
                ...result.post,
                engagement: { likes: 0, comments: 0 },
                isLiked: false,
            };

            setPosts((prev) => [newPost, ...prev]);
            setNewPostContent("");
            setWordCount(0);
            setError(null);
        } catch (err) {
            console.error("Error creating post:", err.message);
            setError("Failed to create post.");
        }
    };

    const likePost = async (postId: string) => {
        try {
            const res = await fetch(`${backendUrl}/api/posts/${postId}/like`, {
                method: "POST",
                headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
            });

            if (!res.ok) throw new Error("Failed to like/unlike post");

            const { engagement, isLiked } = await res.json();

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? { ...post, engagement, isLiked } : post
                )
            );
        } catch (err) {
            console.error("Error liking post:", err);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/);
        setWordCount(text.trim() === "" ? 0 : words.length);
        setNewPostContent(text);
    };

    useEffect(() => {
        if (status === "authenticated") fetchPosts();
    }, [status, fetchPosts]);

    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full">
            <div className="w-full max-w-xl px-4 py-6">
                <div className="text-gray-400 text-sm mb-4">
                    Total Posts: <span className="font-bold text-gray-200">{posts.length}</span>
                </div>

                <div className="bg-dark p-4 rounded-lg shadow-md mb-6">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <textarea
                        value={newPostContent}
                        onChange={handleContentChange}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="w-full bg-gray-800 text-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <div className="flex justify-between items-center mt-2">
                        <p className={`text-sm ${wordCount > 150 ? "text-red-500" : "text-gray-400"}`}>
                            {wordCount}/150 words
                        </p>
                        <Button
                            onClick={createPost}
                            label="Post"
                            disabled={!newPostContent.trim() || wordCount > 150}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        />
                    </div>
                </div>

                {posts.map((post) => (
                    <article key={post._id} className="bg-dark p-4 rounded-lg mb-2">
                        <div className="mb-2">
                            <p className="text-gray-400 text-xs mb-1">
                                {post.user?.username || "Anonymous"} -{" "}
                                {new Date(post.createdAt).toLocaleTimeString()}
                            </p>
                            <p className="text-gray-300 text-sm">{post.content}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                className={`flex items-center space-x-1 ${
                                    post.isLiked ? "text-red-500" : "text-gray-400"
                                }`}
                                onClick={() => likePost(post._id)}
                            >
                                <HeartIcon className="h-5 w-5" />
                                <span>{post.engagement?.likes || 0}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-400">
                                <ChatBubbleLeftIcon className="h-5 w-5" />
                                <span>{post.engagement?.comments || 0}</span>
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Newsfeed;