"use client";

import styles from "@/components/utils/styles/formStyling.module.scss";
import { ServerActionResponse } from "@/lib/types/backend-types";
import { FormFields } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { get, type Mode, useForm } from "react-hook-form";
import { getInputClasses, UseFormInput } from "./ClientOnlyUtils";

type GenericAuthFormProps<GenericFormData extends object> = {
    awaitingMessage?: string;
    submitMessage?: string;
    redirectPath?: string;
    redirectDelay?: number;
    defaultError?: string | null;
    mode?: Mode;
    fields: FormFields<GenericFormData>;
    submitAction: (data: GenericFormData) => ServerActionResponse<unknown>;
};

export const GenericAuthFormSkeleton = () => {
    return (
        <form className={styles.form}>
            <div className={styles["input-group"]}>
                <input className={getInputClasses(false)} />
            </div>
            <div className={styles.submit} />
        </form>
    );
};

const GenericAuthForm = <GenericFormData extends object>({
    awaitingMessage,
    submitMessage = "SUBMIT",
    defaultError,
    fields,
    submitAction,
    redirectPath,
    redirectDelay,
    mode = "onSubmit",
}: GenericAuthFormProps<GenericFormData>) => {
    const router = useRouter();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<GenericFormData>({
        mode,
    });

    const [error, setError] = useState(defaultError || "");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

    const onSubmit = useCallback(
        async (data: GenericFormData) => {
            setError("");
            setSuccess("");
            if (awaiting) return;

            setAwaiting(true);

            const response = await submitAction(data);

            setAwaiting(false);

            if (!response.success) {
                setError(response.error!);
            } else {
                setSuccess(response.message!);
                reset();

                if (redirectPath) {
                    setTimeout(
                        () => router.push(redirectPath),
                        redirectDelay || 0
                    );
                }
            }
        },
        [submitAction, redirectPath, router, redirectDelay, awaiting, reset]
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
        <>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            {awaiting && awaitingMessage && (
                <p className={styles.awaiting}>{awaitingMessage}</p>
            )}

            <form className={styles.form}>
                {fields.map((field) => (
                    <UseFormInput
                        label={field.label}
                        settings={register(field.name, field.options)}
                        error={get(errors, field.name)}
                        key={field.label}
                    />
                ))}
                <div className={styles.submit} onClick={handleSubmit(onSubmit)}>
                    {submitMessage}
                </div>
            </form>
        </>
    );
};

export default GenericAuthForm;
