// This example uses React and Tailwind CSS for rapid prototyping of a modern "Newsfeed" inspired by Instagram and X (Twitter)

import React, { useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineComment, AiOutlineSend } from 'react-icons/ai';
import { FaRegBookmark } from 'react-icons/fa';

// Define TypeScript types for Post and Comment
interface Comment {
    id: number;
    username: string;
    text: string;
}

interface Post {
    id: number;
    username: string;
    userImage: string;
    postImage: string;
    likes: number;
    caption: string;
    comments: Comment[];
}

const mockPosts: Post[] = [
    {
        id: 1,
        username: 'vone_z',
        userImage: '/img/profile-pic.jpg',
        postImage: '/img/post1.jpg',
        likes: 120,
        caption: "Loving the view today! #travel #nature",
        comments: [
            { id: 1, username: 'user123', text: 'Wow, amazing picture!' },
            { id: 2, username: 'traveler_girl', text: 'Where is this place?' },
        ],
    },
    {
        id: 2,
        username: 'nature_fanatic',
        userImage: '/img/profile2.jpg',
        postImage: '/img/post2.jpg',
        likes: 85,
        caption: "Nature never goes out of style. #green",
        comments: [
            { id: 1, username: 'adventurer', text: 'Nature heals the soul!' },
        ],
    },
];

const Newsfeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState<string>('');
    const [newPostImage, setNewPostImage] = useState<string>('');

    useEffect(() => {
        // This could be an API call to fetch real posts
        setPosts(mockPosts);
    }, []);

    const handleAddPost = () => {
        if (newPost.trim() === '') return;

        const newPostData: Post = {
            id: posts.length + 1,
            username: 'current_user',
            userImage: '/img/profile-pic.jpg',
            postImage: newPostImage || '/img/default-post.jpg',
            likes: 0,
            caption: newPost,
            comments: [],
        };

        setPosts([newPostData, ...posts]);
        setNewPost('');
        setNewPostImage('');
    };

    const handleLike = (postId: number) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    return (
        <div className="flex flex-col items-center py-10 bg-gray-100 min-h-screen">
            <div className="w-full max-w-xl">
                {/* Write Something Section */}
                <div className="bg-white shadow-md rounded-lg p-4 mb-8">
          <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write something..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    <input
                        type="text"
                        value={newPostImage}
                        onChange={(e) => setNewPostImage(e.target.value)}
                        placeholder="Image URL (optional)"
                        className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddPost}
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Post
                    </button>
                </div>

                {posts.map((post) => (
                    <div key={post.id} className="bg-white shadow-md rounded-lg mb-8">
                        {/* Header */}
                        <div className="flex items-center p-4">
                            <img
                                src={post.userImage}
                                alt="user profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="ml-4 font-semibold">{post.username}</span>
                        </div>
                        {/* Post Image */}
                        <img src={post.postImage} alt="post" className="w-full object-cover" />
                        {/* Buttons */}
                        <div className="flex justify-between items-center px-4 pt-4">
                            <div className="flex space-x-4">
                                <AiOutlineHeart
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={() => handleLike(post.id)}
                                />
                                <AiOutlineComment className="w-6 h-6 cursor-pointer" />
                                <AiOutlineSend className="w-6 h-6 cursor-pointer" />
                            </div>
                            <FaRegBookmark className="w-6 h-6 cursor-pointer" />
                        </div>
                        {/* Likes */}
                        <p className="px-4 pt-2 font-semibold text-sm">{post.likes} likes</p>
                        {/* Caption */}
                        <p className="px-4 py-2 text-sm">
                            <span className="font-semibold mr-2">{post.username}</span>
                            {post.caption}
                        </p>
                        {/* Comments */}
                        <div className="px-4 pb-4 text-sm text-gray-500">
                            {post.comments.map((comment) => (
                                <p key={comment.id}>
                                    <span className="font-semibold mr-2">{comment.username}</span>
                                    {comment.text}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Newsfeed;
