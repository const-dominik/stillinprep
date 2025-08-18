"use client";

import { changePassword } from "@/lib/actions/passwordRecovery";
import styles from "@/styles/formStyling.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SingleWindowPage, UseFormInput } from "../utils/Utils";
import { validatePassword } from "./utils";

type NewPasswordData = {
    password: string;
    confirmPassword: string;
};

const NewPassword = ({ token }: { token: string }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        reset,
    } = useForm<NewPasswordData>({
        mode: "onChange",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

    const onSubmit = useCallback(
        async (data: NewPasswordData) => {
            setError("");
            setSuccess("");
            setAwaiting(true);

            const response = await changePassword(token, data.password);

            setAwaiting(false);

            if (!response.success) {
                setError(response.error!);
            } else {
                setSuccess(response.message!);
                reset();
            }
        },
        [reset, token]
    );
    const password = watch("password");

    const inputs = {
        Password: register("password", {
            required: "Password is required!",
            validate: validatePassword,
        }),
        "Confirm Password": register("confirmPassword", {
            required: "You need to confirm your password!",
            validate: (value) => value === password || "Passwords don't match.",
        }),
    };

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
        <SingleWindowPage>
            {" "}
            <div className={styles["window-content"]}>
                <p className={styles.title}>Change password</p>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {awaiting && (
                    <p className={styles.awaiting}>Changing password...</p>
                )}
                <form className={styles.form}>
                    {Object.entries(inputs).map(([label, inputSettings]) => (
                        <UseFormInput
                            label={label}
                            settings={inputSettings}
                            error={errors[inputSettings.name]}
                            key={label}
                        />
                    ))}
                    <div
                        className={styles.submit}
                        onClick={handleSubmit(onSubmit)}
                    >
                        SET PASSWORD
                    </div>
                </form>
            </div>
        </SingleWindowPage>
    );
};

export default NewPassword;
