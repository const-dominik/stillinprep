import Header from "@/components/landing/header/Header";
import Link from "next/link";
import { ReactNode } from "react";
import { IoChevronBackOutline, IoExtensionPuzzle } from "react-icons/io5";
import styles from "./Utils.module.scss";

export const SingleWindowPage = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header study={false} logout={false} />
            <div className={styles.container}>
                <div className={styles.window}>
                    <div className={styles["window-content"]}>{children}</div>
                </div>
            </div>
        </>
    );
};

export const Back = ({ url }: { url: string }) => {
    return (
        <Link href={url} className={styles["link"]}>
            <div className={styles["icon-wrapper"]}>
                <IoChevronBackOutline fontSize="2rem" />
            </div>
        </Link>
    );
};

export const GoToPuzzle = () => {
    return (
        <Link href="/puzzles" className={styles["link"]}>
            <div className={styles["icon-wrapper"]}>
                <IoExtensionPuzzle fontSize="2rem" />
            </div>
        </Link>
    );
};
