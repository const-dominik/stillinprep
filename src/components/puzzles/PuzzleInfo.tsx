import { Puzzle, PuzzleFeedback } from "@/lib/types/types";
import { Dispatch, SetStateAction } from "react";
import { FaPlay } from "react-icons/fa";
import styles from "./PuzzleInfo.module.scss";

const feedbacksMap: Record<PuzzleFeedback, string> = {
    go: "What should you play here?",
    other: "This is one of correct moves, what else can you play?",
    correct: "Puzzle solved!",
    wrong: "Wrong move",
    done: "All puzzles for this mode solved.",
};

const PuzzleInfo = ({
    feedback,
    puzzle,
    autoSkip,
    setAutoSkip,
    nextPuzzle,
}: {
    feedback: PuzzleFeedback;
    puzzle: Puzzle;
    autoSkip: boolean;
    setAutoSkip: Dispatch<SetStateAction<boolean>>;
    nextPuzzle: () => void;
}) => {
    return (
        <div className={styles.container}>
            <div className={styles["whose-turn"]}>
                {puzzle.color.toUpperCase()} TO MOVE
            </div>
            <div className={styles["feedback"]}>{feedbacksMap[feedback]}</div>
            <div className={styles["auto-puzzle"]}>
                <input
                    type="checkbox"
                    checked={autoSkip}
                    onChange={() => setAutoSkip((skip) => !skip)}
                />
                <div onClick={() => setAutoSkip((skip) => !skip)}>
                    Auto-skip to next puzzle
                </div>
            </div>
            {!autoSkip && feedback === "correct" && (
                <div className={styles.next} onClick={nextPuzzle}>
                    <FaPlay fontSize="0.8rem" />
                    NEXT
                </div>
            )}
        </div>
    );
};

export default PuzzleInfo;
