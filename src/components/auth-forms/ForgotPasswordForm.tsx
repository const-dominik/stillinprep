"use client";

import styles from "@/components/utils/styles/formStyling.module.scss";
import { resetPassword } from "@/lib/actions/passwordRecovery";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SmallWindowPage, UseFormInput } from "../utils/Utils";

type ForgotData = {
    identifier: string;
};

const ForgotPassword = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<ForgotData>();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

    const onSubmit = useCallback(async (data: ForgotData) => {
        setError("");
        setSuccess("");
        setAwaiting(true);

        const response = await resetPassword(data.identifier);

        setAwaiting(false);

        if (!response.success) {
            setError(response.error!);
            return false;
        } else {
            setSuccess(response.message!);
        }
    }, []);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();

                handleSubmit(onSubmit)();
            }
        };

        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [handleSubmit, onSubmit]);

    return (
        <SmallWindowPage>
            <div className={styles["window-content"]}>
                <p className={styles.title}>Reset password</p>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {awaiting && (
                    <p className={styles.awaiting}>Sending reset email...</p>
                )}
                <form className={styles.form}>
                    <UseFormInput
                        label="Nickname/Email"
                        settings={register("identifier", {
                            required: "Identifier is required!",
                        })}
                        error={errors["identifier"]}
                    />
                    <div
                        className={styles.submit}
                        onClick={handleSubmit(onSubmit)}
                    >
                        RESET
                    </div>
                </form>

                <Link href="/login" className={styles["link"]} prefetch={true}>
                    Remembered your password?
                </Link>
            </div>
        </SmallWindowPage>
    );
};

export default ForgotPassword;
