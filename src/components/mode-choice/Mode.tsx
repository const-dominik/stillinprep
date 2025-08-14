"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

const Mode = ({
    iconPath,
    name,
    redirectPath,
}: {
    iconPath: string;
    name: string;
    redirectPath: string;
}) => {
    const router = useRouter();
    return (
        <div className={styles.mode} onClick={() => router.push(redirectPath)}>
            <h2 className={styles["mode-title"]}>{name}</h2>
            <div className={styles["icon"]}>
                <Image
                    src={iconPath}
                    alt="icon"
                    fill
                    style={{ objectFit: "contain" }}
                />
            </div>
        </div>
    );
};

export default Mode;
