import ForgotPassword from "@/components/auth-forms/ForgotPasswordForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await auth();

    if (session) {
        return redirect("/");
    }

    return <ForgotPassword />;
};

export default Page;
