import { protectRoute } from "@/lib/auth";
import Link from "next/link";
import Header from "../landing/page-sections/header/Header";
import Mode from "./Mode";
import styles from "./styles.module.scss";

const ModeChoice = async () => {
    await protectRoute();

    return (
        <div>
            <Header study={false} />

            <div className={styles["mode-choice"]}>
                <Link href="/repertoire" className={styles["link"]}>
                    <Mode iconPath="mode-choice/pawn.svg" name="Repertoires" />
                </Link>
                <Link href="/puzzles" className={styles["link"]}>
                    <Mode
                        iconPath="mode-choice/jigsaw-piece.svg"
                        name="Puzzles"
                    />
                </Link>
            </div>
        </div>
    );
};

export default ModeChoice;
