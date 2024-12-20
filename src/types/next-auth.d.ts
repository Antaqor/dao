// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            profilePicture?: string | null;
            accessToken?: string | null;
            role?: string;
        };
    }

    interface User {
        id: string;
        username: string;
        email: string;
        profilePicture?: string | null;
        accessToken?: string | null;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        profilePicture?: string | null;
        accessToken?: string | null;
        role?: string;
    }
}