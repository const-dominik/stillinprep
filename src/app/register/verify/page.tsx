import VerifyEmail from "@/components/auth-forms/VerifyEmailForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await auth();

    if (!session || !session.user) {
        return redirect("/login");
    }

    const isCredentialsProvider = session.user.password;
    const isVerified = isCredentialsProvider && session.user.emailVerified;

    if (!isCredentialsProvider || isVerified) {
        return redirect("/");
    }

    return <VerifyEmail email={session.user.email} />;
};

export default Page;
