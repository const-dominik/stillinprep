"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";

const Logo = () => {
    return (
        <Link href="/" prefetch={true} className={styles["link"]}>
            <div className={styles.logo}>
                <Image
                    src="/logo/logo.webp"
                    alt="logo"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 30vw, 5vw"
                />
            </div>
        </Link>
    );
};

export default Logo;
