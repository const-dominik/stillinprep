import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req: NextAuthRequest) => {
    const session = req.auth;

    const { nextUrl } = req;
    const path = nextUrl.pathname;

    const isAuthRoute =
        path === "/login" ||
        path === "/register" ||
        path.startsWith("/forgot-password");
    const isProtected = path !== "/" && path !== "/privacy";

    if (!session && !isAuthRoute && isProtected) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (session) {
        if (!session.user.nickname && path !== "/complete-profile") {
            return NextResponse.redirect(new URL("/complete-profile", nextUrl));
        }

        if (
            session.user.provider === "credentials" &&
            !session.user.isEmailVerified &&
            path !== "/verify-email"
        ) {
            return NextResponse.redirect(new URL("/verify-email", nextUrl));
        }

        if (isAuthRoute) {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|auth|logo|features|pieces|stockfish).*)",
    ],
};
