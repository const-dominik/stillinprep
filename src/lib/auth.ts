import {
    BadCredentials,
    InvalidCredentials,
    SomethingWentWrong,
} from "@/components/auth-forms/utils";
import { Neo4jAdapter } from "@auth/neo4j-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { loginUser } from "./actions/login";
import { neoDriver } from "./neo4j";

const sessionExpiry = 60 * 60 * 24 * 30;

const isSupportedProvider = (
    provider: string
): provider is "github" | "google" | "credentials" =>
    ["google", "github", "credentials"].includes(provider);

const providers: Provider[] = [
    Google({
        profile(profile) {
            return {
                id: profile.sub,
                email: profile.email,
                isEmailVerified: true,
                provider: "google",
            };
        },
    }),
    Github({
        profile(profile) {
            return {
                id: profile.id.toString(),
                email: profile.email!,
                isEmailVerified: true,
                provider: "github",
            };
        },
    }),
    Credentials({
        name: "Credentials",
        credentials: {
            identifier: {},
            password: {},
        },
        async authorize(credentials) {
            const { identifier, password } = credentials;

            if (
                typeof identifier !== "string" ||
                typeof password !== "string"
            ) {
                throw new BadCredentials();
            }

            const response = await loginUser(identifier, password);

            if (!response.success) {
                if (response.error) {
                    if (response.error.includes("doesn't exist")) {
                        throw new InvalidCredentials();
                    }
                }
                throw new SomethingWentWrong();
            }

            if (!response.value) {
                throw new SomethingWentWrong();
            }

            const user = {
                id: response.value.id,
                email: response.value.email,
                nickname: response.value.nickname,
                isEmailVerified: !!response.value.emailVerified,
                provider: "credentials",
            } as const;

            return user;
        },
    }),
];

export const authOptions = NextAuth({
    providers: providers,
    adapter: Neo4jAdapter(neoDriver),
    session: {
        strategy: "jwt",
        maxAge: sessionExpiry,
    },
    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (user && account) {
                token.id = user.id;
                token.email = user.email;
                token.nickname = user.nickname;
                token.isEmailVerified = user.isEmailVerified ?? true;
                if (isSupportedProvider(account.provider)) {
                    token.provider = account.provider;
                }
            }

            if (trigger === "update") {
                const adapter = Neo4jAdapter(neoDriver);
                const dbUser = await adapter.getUser?.(token.id);

                if (dbUser) {
                    token.nickname = user.nickname;
                    token.isEmailVerified = user.isEmailVerified ?? true;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.nickname = token.nickname;
                session.user.isEmailVerified = token.isEmailVerified;
                session.user.provider = token.provider;
            }
            return session;
        },
    },
});

export const { handlers, signIn, signOut, auth } = authOptions;
