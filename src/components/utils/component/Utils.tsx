import Header from "@/components/landing/header/Header";
import Link from "next/link";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { IoChevronBackOutline, IoExtensionPuzzle } from "react-icons/io5";
import styles from "./Utils.module.scss";

export const WindowElement = ({
    children,
    title,
}: {
    children: ReactNode;
    title?: string;
}) => {
    return (
        <div className={styles["flex"]}>
            <p className={styles["title"]}>{title}</p>
            <div className={styles.window}>{children}</div>
        </div>
    );
};

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

export const NavButton = ({ url, Icon }: { url: string; Icon: IconType }) => {
    return (
        <Link href={url} className={styles["link"]}>
            <div className={styles["icon-wrapper"]}>
                <Icon fontSize="2rem" />
            </div>
        </Link>
    );
};

export const RepertoireNav = ({ backUrl }: { backUrl: string }) => (
    <div style={{ display: "flex" }}>
        <NavButton url={backUrl} Icon={IoChevronBackOutline} />
        <NavButton url="/puzzles" Icon={IoExtensionPuzzle} />
    </div>
);
