import { WithParams } from "@/components/utils/component/WithParams";
import styles from "@/components/utils/styles/formStyling.module.scss";
import { verifyEmail } from "@/lib/actions/register";
import { Suspense } from "react";

const VerifyEmail = async ({ token }: { token: string }) => {
    const result = await verifyEmail(token);

    return (
        <div className={styles["verify-div"]}>
            {result.success && "Verified!"}
            {!result.success && String(result.error)}
        </div>
    );
};

const Content = async ({ params }: { params: Promise<{ token: string }> }) => {
    return (
        <Suspense
            fallback={
                <div className={styles["verify-div"]}>
                    We&apos;re verifying your email...
                </div>
            }
        >
            <WithParams params={params}>
                {(params) => <VerifyEmail token={params.token} />}
            </WithParams>
        </Suspense>
    );
};

export default Content;
