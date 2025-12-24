import CompleteProfileForm from "@/components/auth-forms/CompleteProfileForm";
import { GenericAuthFormSkeleton } from "@/components/utils/component/GenericAuthForm";
import { WithSession } from "@/components/utils/component/WithSession";
import styles from "@/components/utils/styles/formStyling.module.scss";

const Page = async () => {
    return (
        <>
            <p className={styles.title}>Complete Profile</p>
            <WithSession fallback={<GenericAuthFormSkeleton />}>
                {(session) => <CompleteProfileForm id={session.user.id} />}
            </WithSession>
        </>
    );
};

export default Page;
