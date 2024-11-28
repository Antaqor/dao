import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios, { AxiosError } from 'axios';

// Define the User type explicitly (optional, since it's now in the global types)
interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
}

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
                    // Use environment variable for the backend URL to avoid hardcoding
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

                    if (!backendUrl) {
                        throw new Error('Backend URL is not defined. Please set NEXT_PUBLIC_BACKEND_API_URL in your environment variables.');
                    }

                    // Make the API call to the backend for authentication
                    const response = await axios.post(`${backendUrl}/api/auth/login`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    });

                    if (response.status === 200 && response.data.user) {
                        const user: User = response.data.user; // Type the user response
                        return user;
                    } else {
                        console.error('Login failed:', response.data?.error || 'Unknown error');
                        return null; // Login failed
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<{ error: string }>; // Properly type the error as AxiosError
                    if (axiosError.response?.data?.error) {
                        console.error('Authorization error:', axiosError.response.data.error);
                    } else {
                        console.error('Unexpected error during authorization:', axiosError.message);
                    }
                    return null; // Login failed
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Assign user properties to the JWT token
                token.id = (user as User).id;
                token.email = (user as User).email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // Assign token properties to the session user object
                session.user = {
                    ...(session.user || {}),
                    id: token.id as string,
                    email: token.email as string,
                } as User; // Cast session.user as User type
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login', // Redirect to a custom login page
        error: '/auth/error',  // Optional custom error page
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
};

export default NextAuth(authOptions);