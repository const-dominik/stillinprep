import { capitalize } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { ReactNode } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import styles from "./Utils.module.scss";

export const SingleWindowPage = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.container}>
            <div className={styles.window}>{children}</div>
        </div>
    );
};

export const SmallWindowPage = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.container}>
            <div className={styles["half-window"]}>{children}</div>
        </div>
    );
};

const getInputClasses = (error: boolean) => {
    const classes = [styles.input, styles["no-autofill-bg"]];

    if (error) {
        classes.push(styles["input-error"]);
    }

    return classes.join(" ");
};

const getLabelClasses = (error: boolean) => {
    const classes = [styles["label-on-border"]];

    if (error) {
        classes.push(styles["label-error"]);
    }

    return classes.join(" ");
};

const labelToId = (label: string) => label.toLowerCase().replaceAll(" ", "-");

export const UseFormInput = ({
    settings,
    label,
    error,
}: {
    label: string;
    settings: UseFormRegisterReturn;
    error?: FieldError;
}) => {
    const isPassword = label.toLowerCase().includes("password");

    return (
        <div className={styles["input-group"]}>
            <input
                {...settings}
                className={getInputClasses(Boolean(error))}
                type={isPassword ? "password" : "text"}
                aria-labelledby={labelToId(label)}
            />
            <label
                className={getLabelClasses(Boolean(error))}
                id={labelToId(label)}
            >
                {label}
            </label>
            {error && (
                <p className={styles["error-message"]}>{error.message}</p>
            )}
        </div>
    );
};

export const LoginWith = ({ provider }: { provider: "google" | "github" }) => (
    <div className={styles["login-with"]} onClick={() => signIn(provider)}>
        <Image
            src={`/auth/${provider}.svg`}
            alt={`${provider}-icon`}
            width={20}
            height={20}
        />
        <span className={styles["login-with-text"]}>
            Continue with {capitalize(provider)}
        </span>
    </div>
);
