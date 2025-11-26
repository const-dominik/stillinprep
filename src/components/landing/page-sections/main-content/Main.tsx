"use cache";

import Image from "next/image";
import Feature from "./Feature";
import styles from "./styles.module.scss";

const Main = async () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image
                    src="/features/main.webp"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={styles.image}
                    alt="repertoire"
                />
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>Level up your openings!</h1>
                <p className={styles.subtitle}>
                    Master your chess repertoire with advanced analysis and
                    training
                </p>

                <div className={styles.features}>
                    <Feature icon="🔍" text="Consider best Stockfish moves" />
                    <Feature
                        icon="📊"
                        text="Check popularity of different moves at your level"
                    />
                    <Feature icon="🕳️" text="Find holes in your repertoire" />
                    <Feature
                        icon="🧩"
                        text="Solve puzzles from your repertoire with spaced repetition"
                    />
                    <Feature icon="💸" text="... and it's completely free!" />
                </div>
            </div>
        </div>
    );
};

export default Main;
