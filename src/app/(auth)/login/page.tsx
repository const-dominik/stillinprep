import LoginForm from "@/components/auth-forms/LoginForm";
import { LoginWith } from "@/components/utils/component/ClientOnlyUtils";
import { GenericAuthFormSkeleton } from "@/components/utils/component/GenericAuthForm";
import styles from "@/components/utils/styles/formStyling.module.scss";
import Link from "next/link";
import { Suspense } from "react";

const Login = async () => {
    return (
        <>
            <p className={styles.title}>Login</p>

            <Suspense fallback={<GenericAuthFormSkeleton />}>
                <LoginForm />
            </Suspense>

            <div className={styles["login-with-container"]}>
                <LoginWith provider={"google"} />
                <LoginWith provider={"github"} />
            </div>

            <div className={styles["links"]}>
                <Link href="/forgot-password" className={styles["link"]}>
                    Forgot your password?
                </Link>
                <Link href="/register" className={styles["link"]}>
                    Don&apos;t have an account?
                </Link>
            </div>
        </>
    );
};

export default Login;
