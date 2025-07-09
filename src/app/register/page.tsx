import RegistrationForm from "@/components/auth-forms/RegistrationForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Register = async () => {
    const session = await auth();

    if (session) {
        return redirect("/");
    }

    return <RegistrationForm />;
};

export default Register;
