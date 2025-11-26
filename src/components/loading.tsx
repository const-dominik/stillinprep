import Image from "next/image";
import styles from "./Loading.module.scss";
const Loading = () => (
    <div className={styles.container}>
        <div className={styles["flex"]}>
            <p className={styles["big-text"]}>Loading...</p>
            <Image
                src="/pieces/wN.svg"
                alt="spinning knight"
                width={120}
                height={120}
                className={styles.spinning}
            />
        </div>
    </div>
);

export default Loading;
