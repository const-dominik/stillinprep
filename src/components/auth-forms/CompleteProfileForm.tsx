"use client";

import styles from "@/components/utils/styles/formStyling.module.scss";
import { completeProfile } from "@/lib/actions/completeProfile";
import { nicknameRegex } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SmallWindowPage, UseFormInput } from "../utils/Utils";

type CompleteProfileData = {
    nickname: string;
};

const CompleteProfileForm = ({ id }: { id: string }) => {
    const router = useRouter();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<CompleteProfileData>({
        mode: "onChange",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [awaiting, setAwaiting] = useState(false);

    const onSubmit = useCallback(
        async (data: CompleteProfileData) => {
            setError("");
            setSuccess("");

            setAwaiting(true);
            const response = await completeProfile(id, data.nickname);

            setAwaiting(false);

            if (!response.success) {
                setError(response.error!);
            } else {
                setSuccess("Completed!");
                router.push("/");
            }
        },
        [id, router]
    );

    const nickInput = register("nickname", {
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
    });

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
                <p className={styles.title}>Complete Profile</p>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                {awaiting && <p className={styles.awaiting}>Completing...</p>}
                <form className={styles.form}>
                    <UseFormInput
                        label={"Nickname"}
                        settings={nickInput}
                        error={errors[nickInput.name]}
                    />
                    <div
                        className={styles.submit}
                        onClick={handleSubmit(onSubmit)}
                    >
                        COMPLETE
                    </div>
                </form>
                <div></div>
            </div>
        </SmallWindowPage>
    );
};

export default CompleteProfileForm;
