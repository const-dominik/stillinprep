import { DbRepertoires } from "@/lib/types/backend-types";
import { MyOption, PuzzleMode } from "@/lib/types/types";
import { Dispatch, SetStateAction } from "react";
import { SelectRepertoire } from "../utils/Utils";
import styles from "./styles/PuzzleModeChoice.module.scss";

const getClasses = (mode: PuzzleMode, element: PuzzleMode) => {
    const classes = [styles.option];
    if (element === "repertoire") classes.push(styles["flex"]);
    if (mode === element) classes.push(styles["selected-option"]);
    return classes.join(" ");
};

const PuzzleModeChoice = ({
    mode,
    setMode,
    repertoires,
    repertoire,
    setRepertoire,
    spacedPuzzlesAmount,
}: {
    mode: PuzzleMode;
    repertoires: DbRepertoires["owned"];
    repertoire: MyOption | null;
    setMode: Dispatch<SetStateAction<PuzzleMode>>;
    setRepertoire: Dispatch<SetStateAction<MyOption | null>>;
    spacedPuzzlesAmount: number;
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>PUZZLE MODE</div>
            <div className={styles.options}>
                <div
                    className={getClasses(mode, "global")}
                    onClick={() => setMode("global")}
                >
                    random
                </div>
                <div
                    className={getClasses(mode, "repertoire")}
                    onClick={() => setMode("repertoire")}
                >
                    repertoire
                    {mode === "repertoire" && (
                        <SelectRepertoire
                            instanceId="select-puzzle-repertoire"
                            repertoires={repertoires}
                            setRepertoire={setRepertoire}
                            chosenRepertoire={repertoire}
                            isSearchable={true}
                        />
                    )}
                </div>
                <div
                    className={getClasses(mode, "spaced")}
                    onClick={() => spacedPuzzlesAmount > 0 && setMode("spaced")}
                >
                    spaced repetition
                    <div className={styles["spaced-amount"]}>
                        {spacedPuzzlesAmount}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuzzleModeChoice;
