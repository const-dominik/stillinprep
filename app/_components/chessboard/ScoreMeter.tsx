import styles from "./styles.module.scss";
import { StockfishEval } from "@/app/types/types";
import { useEffect, useState } from "react";

const ScoreMeter = ({ score }: { score?: StockfishEval }) => {
    const [whiteHeight, setWhiteHeight] = useState(4);

    useEffect(() => {
        if (!score) return;

        if (score.type === "mate") {
            setWhiteHeight(score.value > 0 ? 8 : 0);
            return;
        }
        const s = score.value / 100;
        const maxUnits = 3.9;
        const maxScore = 15;

        const raw =
            maxUnits * (Math.log2(1 + Math.abs(s)) / Math.log2(1 + maxScore));

        console.log(s, raw);

        const scoreUnits = 4 + Math.sign(s) * raw;

        setWhiteHeight(scoreUnits);
    }, [score]);

    return (
        <div className={styles.scoremeter}>
            <div
                className={styles.whitescore}
                style={{ "--score-units": whiteHeight } as React.CSSProperties}
            ></div>
        </div>
    );
};

export default ScoreMeter;
