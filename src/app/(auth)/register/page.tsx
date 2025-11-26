import RegistrationForm from "@/components/auth-forms/RegistrationForm";
import { LoginWith } from "@/components/utils/component/ClientOnlyUtils";
import styles from "@/components/utils/styles/formStyling.module.scss";
import Link from "next/link";

const Register = async () => {
    return (
        <>
            <p className={styles.title}>Register</p>

            <RegistrationForm />

            <div className={styles["login-with-container"]}>
                <LoginWith provider={"google"} />
                <LoginWith provider={"github"} />
            </div>

            <Link href="/login" className={styles["link"]}>
                Already have an account?
            </Link>
        </>
    );
};

export default Register;
