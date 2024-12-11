// pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "goku" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    throw new Error("No credentials provided");
                }

                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001';

                try {
                    const res = await fetch(`${backendUrl}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to login');
                    }

                    return {
                        id: data.user.id,
                        username: data.user.username,
                        email: data.user.email,
                        profilePicture: data.user.profilePicture,
                        accessToken: data.token, // Store the token
                    };
                } catch (error) {
                    console.error('Error during authorization:', error);
                    throw new Error('Failed to login');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.profilePicture = user.profilePicture;
                token.accessToken = user.accessToken; // Store token in JWT
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.profilePicture = token.profilePicture as string;
                session.user.accessToken = token.accessToken as string; // Store token in session
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login', // Custom login page
    },
    secret: process.env.NEXTAUTH_SECRET,
});