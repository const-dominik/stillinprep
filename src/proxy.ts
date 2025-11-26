import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req: NextAuthRequest) => {
    const session = req.auth;

    const { nextUrl } = req;
    const path = nextUrl.pathname;

    const isAuthRoute =
        path === "/login" ||
        path.startsWith("/register") ||
        path.startsWith("/forgot-password");
    const isProtected = path !== "/" && path !== "/privacy";

    if (!session && !isAuthRoute && isProtected) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (session) {
        if (!session.user.nickname) {
            return NextResponse.redirect(
                new URL("/register/complete", nextUrl)
            );
        }

        if (
            session.user.provider === "credentials" &&
            !session.user.isEmailVerified
        ) {
            return NextResponse.redirect(new URL("/register/verify", nextUrl));
        }

        if (isAuthRoute) {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};
