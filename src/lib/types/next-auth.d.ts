import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        nickname?: string;
        isEmailVerified?: boolean;
        provider?: "github" | "google" | "credentials";
    }

    interface Session {
        user: {
            id: string;
            email: string;
            nickname?: string;
            isEmailVerified: boolean;
            provider: "github" | "google" | "credentials";
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        nickname?: string;
        isEmailVerified: boolean;
        provider: "github" | "google" | "credentials";
    }
}
