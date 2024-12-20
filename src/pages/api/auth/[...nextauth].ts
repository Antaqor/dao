// src/pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios, { AxiosError } from 'axios';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Username' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://152.42.243.146:5000';

                    if (!backendUrl) {
                        throw new Error('Backend URL is not defined. Please set NEXT_PUBLIC_BACKEND_API_URL in your environment variables.');
                    }

                    const response = await axios.post(`${backendUrl}/api/auth/login`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    });

                    if (response.status === 200 && response.data.user) {
                        const user = response.data.user;
                        return user;
                    } else {
                        console.error('Login failed:', response.data?.error || 'Unknown error');
                        return null;
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<{ error: string }>;
                    if (axiosError.response?.data?.error) {
                        console.error('Authorization error:', axiosError.response.data.error);
                    } else {
                        console.error('Unexpected error during authorization:', axiosError.message);
                    }
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.role = user.role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);