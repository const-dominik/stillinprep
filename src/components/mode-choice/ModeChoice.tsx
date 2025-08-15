import { protectRoute } from "@/lib/auth";
import Header from "../landing/page-sections/header/Header";
import Mode from "./Mode";
import styles from "./styles.module.scss";

const ModeChoice = async () => {
    await protectRoute();

    return (
        <div>
            <Header study={false} />

            <div className={styles["mode-choice"]}>
                <Mode
                    iconPath="mode-choice/pawn.svg"
                    name="Repertoires"
                    redirectPath="/repertoire"
                />
                <Mode
                    iconPath="mode-choice/jigsaw-piece.svg"
                    name="Puzzles"
                    redirectPath="/puzzles"
                />
            </div>
        </div>
    );
};

export default ModeChoice;
