import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios, { AxiosError } from 'axios';

// Define a User interface explicitly for better type safety
interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
}

// Hardcoded backend API base URL
const backendUrl = 'http://152.42.243.146:5000';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials', // Name shown in the login form
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Username' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {
                try {
                    // Log the backend URL for debugging
                    if (process.env.NODE_ENV === 'development') {
                        console.debug(`Using hardcoded backend URL: ${backendUrl}`);
                    }

                    // Make the API call to the backend for user authentication
                    const response = await axios.post(`${backendUrl}/api/auth/login`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    });

                    // Check if the response is successful and contains a user
                    if (response.status === 200 && response.data.user) {
                        const user: User = response.data.user; // Extract the user object
                        return user;
                    } else {
                        // Log errors for easier debugging
                        console.error('Login failed:', response.data?.error || 'Unknown error');
                        return null;
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<{ error: string }>; // Type the error for clarity
                    if (axiosError.response?.data?.error) {
                        console.error('Authorization error from backend:', axiosError.response.data.error);
                    } else {
                        console.error('Unexpected error during authorization:', axiosError.message);
                    }
                    return null; // Return null on login failure
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET, // Use a strong secret for signing NextAuth tokens
    callbacks: {
        // Handle JWT customization for session storage
        async jwt({ token, user }) {
            if (user) {
                // Add user-specific properties to the token
                token.id = (user as User).id;
                token.email = (user as User).email;
            }
            return token;
        },
        // Customize the session object with token properties
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...(session.user || {}),
                    id: token.id as string,
                    email: token.email as string,
                } as User;
            }
            return session;
        },
    },
    // Define custom pages for authentication flow
    pages: {
        signIn: '/auth/login', // Redirect users to a custom login page
        error: '/auth/error',  // Redirect users to a custom error page on failure
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in development mode
};

export default NextAuth(authOptions);