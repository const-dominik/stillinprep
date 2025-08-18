import Image from "next/image";
import styles from "./styles.module.scss";

const Mode = ({ iconPath, name }: { iconPath: string; name: string }) => {
    return (
        <div className={styles.mode}>
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
