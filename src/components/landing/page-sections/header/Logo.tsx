import Image from "next/image";
import styles from "./styles.module.scss";

const Logo = () => {
    return (
        <div className={styles.logo}>
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
