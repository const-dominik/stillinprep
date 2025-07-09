import LoginForm from "@/components/auth-forms/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Login = async () => {
    const session = await auth();

    if (session) {
        redirect("/");
    }

    return <LoginForm />;
};

export default Login;
