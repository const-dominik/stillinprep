import "next-auth";

declare module "next-auth" {
    interface User {
        email: string;
        id: string;
        nickname?: string | null | undefined;
        emailVerified?:
            | {
                  [x: string]: unknown;
              }
            | null
            | undefined;
        password?: string | undefined;
    }
}
