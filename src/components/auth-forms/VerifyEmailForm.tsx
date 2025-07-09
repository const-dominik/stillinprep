"use client";

import { createVerificationToken } from "@/lib/actions/register";
import { useEffect, useState } from "react";
import { SmallWindowPage } from "../utils/Utils";
import styles from "./styles.module.scss";

const VerifyEmail = ({ email }: { email: string }) => {
    const [resendCounter, setResendCounter] = useState(0);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (resendCounter === 0) return;

        const timer = setInterval(() => {
            setResendCounter((prev) => {
                if (prev === 0) {
                    clearInterval(timer);
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCounter]);

    const resendEmail = async () => {
        if (resendCounter > 0) return;

        setResendCounter(60);
        const response = await createVerificationToken(email);

        if (response.success) {
            setSuccess("Email sent!");
        }
    };

    return (
        <SmallWindowPage>
            <p className={styles.title}>Verification Needed</p>

            <p className={styles.awaiting}>
                To continue, please verify your email by clicking the link we
                sent you in an email.
            </p>

            {success && <p className={styles.success}>{success}</p>}

            <div
                className={styles.submit}
                style={{
                    cursor: resendCounter > 0 ? "not-allowed" : "pointer",
                    opacity: resendCounter > 0 ? 0.5 : 1,
                    userSelect: "none",
                }}
                onClick={resendEmail}
            >
                {resendCounter > 0 ? `Resend in ${resendCounter}s` : "RESEND"}
            </div>
        </SmallWindowPage>
    );
};

export default VerifyEmail;
