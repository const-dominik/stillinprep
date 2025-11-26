import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { Suspense, type ReactNode } from "react";

type WithSessionProps = {
    children: (session: Session) => ReactNode;
    fallback: ReactNode;
};

const WithSessionContent = async ({
    children,
}: Omit<WithSessionProps, "fallback">) => {
    const session = await auth();

    // It's impossible to be unauthorized and trying to access components that require auth
    // since we're authorizing and redirecting in middleware, but TS doesn't know that

    return <>{children(session!)}</>;
};

export const WithSession = ({ children, fallback }: WithSessionProps) => {
    return (
        <Suspense fallback={fallback}>
            <WithSessionContent>{children}</WithSessionContent>
        </Suspense>
    );
};
