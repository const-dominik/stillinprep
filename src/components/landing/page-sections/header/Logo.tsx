"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

const Logo = () => {
    const router = useRouter();

    return (
        <div className={styles.logo} onClick={() => router.push("/")}>
            <Image
                src="/logo/logo.png"
                alt="logo"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 30vw, 5vw"
            />
        </div>
    );
};

export default Logo;
