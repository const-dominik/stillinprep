import VerifyEmail from "@/components/auth-forms/VerifyEmailForm";
import { WithSession } from "@/components/utils/component/WithSession";
import styles from "@/components/utils/styles/formStyling.module.scss";

const Page = async () => {
    return (
        <>
            <p className={styles.title}>Verification Needed</p>

            <p className={styles.awaiting}>
                To continue, please verify your email by clicking the link we
                sent you in an email.
            </p>

            <WithSession fallback={<></>}>
                {(session) => <VerifyEmail email={session.user.email} />}
            </WithSession>
        </>
    );
};

export default Page;
