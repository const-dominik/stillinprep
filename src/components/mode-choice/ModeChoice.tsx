"use client";

import Mode from "./Mode";
import styles from "./styles.module.scss";

const ModeChoice = () => {
    return (
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
            <Mode
                iconPath="mode-choice/sherlock-holmes.svg"
                name="Repertoire Analysis"
                redirectPath="#"
            />
        </div>
    );
};

export default ModeChoice;
