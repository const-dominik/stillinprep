"use client";

import styles from "@/components/utils/styles/formStyling.module.scss";
import { emailRegex, nicknameRegex } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginWith, SingleWindowPage, UseFormInput } from "../utils/Utils";
import { getErrorMessage } from "./utils";

type LoginData = {
    loginOrEmail: string;
    password: string;
};

const LoginForm = () => {
    const searchParams = useSearchParams();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        mode: "onChange",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

    const inputs = {
        "Nickname/Email": register("loginOrEmail", {
            required: "Nickname or email is required.",
            validate: (value) =>
                (nicknameRegex.test(value) && value.length >= 3) ||
                emailRegex.test(value) ||
                "Type proper nickname or email.",
        }),
        Password: register("password", {
            required: "Password is required!",
        }),
    };

    const onSubmit = useCallback(async (data: LoginData) => {
        setError("");
        setSuccess("");
        setAwaiting(true);

        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.loginOrEmail,
            password: data.password,
        });

        setAwaiting(false);

        if (!result?.ok || result.error) {
            setError(getErrorMessage(result.code || ""));
        } else {
            redirect("/");
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

    useEffect(() => {
        const queryError = searchParams.get("error");
        if (queryError) {
            setError(getErrorMessage(queryError));
        }
    }, [searchParams]);

    return (
        <SingleWindowPage>
            <div className={styles["window-content"]}>
                <p className={styles.title}>Login</p>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {awaiting && <p className={styles.awaiting}>Signing in...</p>}
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
                        LOGIN
                    </div>
                </form>
                <div>
                    <LoginWith provider={"google"} />
                    <LoginWith provider={"github"} />
                </div>
                <div className={styles["links"]}>
                    <Link
                        href="/forgot-password"
                        className={styles["link"]}
                        prefetch={true}
                    >
                        Forgot your password?
                    </Link>
                    <Link
                        href="/register"
                        className={styles["link"]}
                        prefetch={true}
                    >
                        Don&apos;t have an account?
                    </Link>
                </div>
            </div>
        </SingleWindowPage>
    );
};

export default LoginForm;
