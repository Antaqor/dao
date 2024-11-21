import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid profile email"
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ account, profile }: { account: any, profile: any }) {
            if (account.provider === "google") {
                return (profile as any).email_verified && (profile as any).email.endsWith("@gmail.com");
            }
            return true; // Default to allow all sign-ins
        }
    },
    debug: true, // Enable debug output in your console
};

export default NextAuth(authOptions);
