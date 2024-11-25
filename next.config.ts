// Import and configure dotenv at the top of your configuration file
import { config } from 'dotenv';
config(); // This will load environment variables from a .env file into process.env

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
};

export default nextConfig;
