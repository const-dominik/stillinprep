import NewPassword from "@/components/auth-forms/NewPasswordForm";

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params;
    return <NewPassword token={token} />;
};

export default Page;
