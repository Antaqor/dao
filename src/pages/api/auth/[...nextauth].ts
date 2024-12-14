// src/pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface LoginResponse {
    user: {
        id: string;
        username: string;
        email: string;
        role?: string;
        profilePicture?: string;
    };
    token: string;
    error?: string;
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "goku" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
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

                    const data: LoginResponse = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to login');
                    }

                    return {
                        id: data.user.id,
                        username: data.user.username,
                        email: data.user.email,
                        profilePicture: data.user.profilePicture,
                        accessToken: data.token,
                        role: data.user.role || 'user',
                    };
                } catch (error: unknown) {
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
                token.accessToken = user.accessToken;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.profilePicture = token.profilePicture as string;
                session.user.accessToken = token.accessToken as string;
                (session.user as {role?: string}).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
});