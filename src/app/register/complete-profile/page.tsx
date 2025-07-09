import CompleteProfileForm from "@/components/auth-forms/CompleteProfileForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    if (session && session.user.nickname) {
        redirect("/");
    }

    return <CompleteProfileForm id={session.user.id} />;
};

export default Page;
