"use client";

import { SingleWindowPage, UseFormInput } from "@/components/utils/Utils";
import { registerUser } from "@/lib/actions/register";
import { RegistrationData } from "@/lib/types/types";
import { emailRegex, nicknameRegex } from "@/lib/utils";
import styles from "@/styles/formStyling.module.scss";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validatePassword } from "./utils";

const RegistrationForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<RegistrationData>({
        mode: "onChange",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

    const password = watch("password");
    const inputs = {
        Nickname: register("nickname", {
            required: "Nickname is required!",
            pattern: {
                value: nicknameRegex,
                message:
                    "Nickname can consist only of numbers, letters and underscores.",
            },
            minLength: {
                value: 3,
                message: "Nickname has to be at least 3 characters long.",
            },
            maxLength: {
                value: 20,
                message: "Nickname has to be at most 20 characters long.",
            },
        }),
        Email: register("email", {
            required: "Email is required!",
            pattern: {
                value: emailRegex,
                message: "It has to be an email!",
            },
        }),
        Password: register("password", {
            required: "Password is required!",
            validate: validatePassword,
        }),
        "Confirm Password": register("confirmPassword", {
            required: "You need to confirm your password!",
            validate: (value) => value === password || "Passwords don't match.",
        }),
    };

    const onSubmit = useCallback(
        async (data: RegistrationData) => {
            setError("");
            setSuccess("");
            if (awaiting) return;

            setAwaiting(true);
            const res = await registerUser(data);
            setAwaiting(false);

            if (!res.success) {
                setError(String(res.error));
            } else if (res.message) {
                setSuccess(res.message);
                reset();
            }
        },
        [awaiting, reset]
    );

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
            <div className={styles["window-content"]}>
                <p className={styles.title}>Register</p>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {awaiting && <p className={styles.awaiting}>Registering...</p>}
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
                        REGISTER
                    </div>
                </form>
                <Link href="/login" className={styles["link"]}>
                    Already have an account?
                </Link>
            </div>
        </SingleWindowPage>
    );
};

export default RegistrationForm;
