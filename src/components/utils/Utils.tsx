"use client";

import { DbRepertoires } from "@/lib/types/backend-types";
import { MyOption } from "@/lib/types/types";
import { capitalize } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import styles from "./Utils.module.scss";

export const WindowElement = ({ children }: { children: ReactNode }) => {
    return <div className={styles.window}>{children}</div>;
};

export const SingleWindowPage = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.container}>
            <WindowElement>{children}</WindowElement>
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

export const SmallInfoPage = ({ children }: { children: ReactNode }) => {
    return (
        <SmallWindowPage>
            <div className={styles.info}>{children}</div>
        </SmallWindowPage>
    );
};

export const getInputClasses = (error: boolean) => {
    const classes = [styles.input, styles["no-autofill-bg"]];

    if (error) {
        classes.push(styles["input-error"]);
    }

    return classes.join(" ");
};

export const getLabelClasses = (error: boolean) => {
    const classes = [styles["label-on-border"]];

    if (error) {
        classes.push(styles["label-error"]);
    }

    return classes.join(" ");
};

export const labelToId = (label: string) =>
    label.toLowerCase().replaceAll(" ", "-");

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

const customSelectStyles: StylesConfig<MyOption> = {
    control: (base) => ({
        ...base,
        background: "transparent",
        border: "1px solid var(--palette-7)",
        fontSize: "1rem",
        color: "var(--palette-1)",
        boxShadow: "none",
        outline: "none",
        cursor: "pointer",

        "&:hover": {
            borderColor: "var(--palette-7)",
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: "var(--palette-1)",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "var(--palette-5)",
        color: "var(--palette-1)",
        borderRadius: "5px",
        zIndex: 10,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "var(--palette-6)" : "transparent",
        color: "var(--palette-1)",
        cursor: "pointer",

        ":active": {
            backgroundColor: "var(--palette-6)",
        },
    }),
};

export const SelectRepertoire = ({
    repertoires,
    setRepertoire,
    chosenRepertoire,
}: {
    repertoires: DbRepertoires["owned"];
    setRepertoire: Dispatch<SetStateAction<MyOption | null>>;
    chosenRepertoire: MyOption | null;
}) => {
    const options: MyOption[] = repertoires.map((repertoire) => ({
        value: repertoire.id,
        label: repertoire.name,
    }));

    return (
        <Select<MyOption, false>
            styles={customSelectStyles}
            options={options}
            placeholder="Choose repertoire.."
            onChange={(selected) => {
                setRepertoire(selected);
            }}
            isSearchable={false}
            value={
                options.find((opt) => opt.value === chosenRepertoire?.value) ??
                null
            }
        />
    );
};
