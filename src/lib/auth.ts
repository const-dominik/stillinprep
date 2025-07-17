import {
    BadCredentials,
    InvalidCredentials,
    SomethingWentWrong,
} from "@/components/auth-forms/utils";
import { Neo4jAdapter } from "@auth/neo4j-adapter";
import NextAuth from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { loginUser } from "./actions/login";
import { getNeoSession } from "./neo4j";

const sessionExpiry = 60 * 60 * 24 * 30;

const providers: Provider[] = [
    Google,
    Github,
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
            };

            return user;
        },
    }),
];

export const authOptions = NextAuth({
    providers: providers,
    adapter: Neo4jAdapter(getNeoSession()),
    session: {
        strategy: "database",
    },
    pages: {
        signIn: "/login",
    },
    // Logic to override default next-auth behaviour,
    // which prevents storing session for users logged in via Credentials in database
    jwt: {
        encode: async (params) => {
            if (params.token?.credentials) {
                const sessionToken = v4();

                const neoSession = getNeoSession();

                const adapter = Neo4jAdapter(neoSession);
                try {
                    await adapter.createSession!({
                        sessionToken,
                        userId: params.token.sub!,
                        expires: new Date(Date.now() + sessionExpiry * 1000),
                    });
                } finally {
                    await neoSession.close();
                }

                return sessionToken;
            }

            return defaultEncode(params);
        },
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider === "credentials") {
                token.credentials = true;
            }
            return token;
        },
    },
});

export const { handlers, signIn, signOut, auth } = authOptions;

export const protectRoute = async () => {
    if (process.env.TEST_ENV) return;
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const user = session.user;

    const usedCredentials = !!user.password;

    if (usedCredentials && !user.emailVerified) {
        redirect("register/verify");
    }

    if (!user.nickname) {
        redirect("register/complete-profile");
    }
};
