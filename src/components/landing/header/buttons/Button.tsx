import Link from "next/link";
import styles from "./styles.module.scss";

const Button = ({ text, href }: { text: string; href: string }) => {
    return (
        <Link href={href} className={styles.link}>
            <div className={styles.button}>{text}</div>
        </Link>
    );
};

export default Button;
