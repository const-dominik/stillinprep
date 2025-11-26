import NewPassword from "@/components/auth-forms/NewPasswordForm";
import { GenericAuthFormSkeleton } from "@/components/utils/component/GenericAuthForm";
import { WithParams } from "@/components/utils/component/WithParams";
import styles from "@/components/utils/styles/formStyling.module.scss";
import { Suspense } from "react";

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
    return (
        <>
            <p className={styles.title}>Change password</p>
            <Suspense fallback={<GenericAuthFormSkeleton />}>
                <WithParams params={params}>
                    {({ token }) => <NewPassword token={token} />}
                </WithParams>
            </Suspense>
        </>
    );
};

export default Page;
