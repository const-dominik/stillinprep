"use client";

import styles from "@/components/utils/styles/formStyling.module.scss";
import { createVerificationToken } from "@/lib/actions/register";
import { useEffect, useState } from "react";

const VerifyEmail = ({ email }: { email: string }) => {
    const [resendCounter, setResendCounter] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

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
        if (resendCounter > 0 || awaiting) return;

        setAwaiting(true);
        setResendCounter(60);

        const response = await createVerificationToken(email);

        setAwaiting(false);

        if (response.success) {
            setSuccess("Email sent!");
        }

        if (!response.success) {
            setError(response.error);
        }
    };

    const isCountdownActive = resendCounter > 0;
    const buttonContent = isCountdownActive
        ? `Resend in ${resendCounter}s`
        : "RESEND";
    const classes = [styles.submit];

    if (!isCountdownActive) {
        classes.push(styles["resend-active"]);
    } else {
        classes.push(styles["resend-inactive"]);
    }

    return (
        <>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            {awaiting && <p className={styles.awaiting}>Sending email...</p>}

            <div className={classes.join(" ")} onClick={resendEmail}>
                {buttonContent}
            </div>
        </>
    );
};

export default VerifyEmail;
