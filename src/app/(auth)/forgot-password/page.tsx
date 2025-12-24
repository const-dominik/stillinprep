import ForgotPassword from "@/components/auth-forms/ForgotPasswordForm";
import styles from "@/components/utils/styles/formStyling.module.scss";
import Link from "next/link";

const Page = async () => {
    return (
        <>
            <p className={styles.title}>Reset password</p>

            <ForgotPassword />

            <Link href="/login" className={styles["link"]} prefetch={true}>
                Remembered your password?
            </Link>
        </>
    );
};

export default Page;
