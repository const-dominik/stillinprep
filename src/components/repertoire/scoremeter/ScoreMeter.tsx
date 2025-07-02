import { useStockfishContext } from "@/lib/context/stockfish/StockfishContext";
import { useEffect, useState } from "react";
import { parseStockfishScore } from "../stockfish/logic";
import { calculateScoreUnits } from "./logic";
import styles from "./styles/ScoreMeter.module.scss";

const ScoreMeter = () => {
    const [whiteHeight, setWhiteHeight] = useState(4);
    const { multiPV } = useStockfishContext();

    const score = multiPV[0]?.line.score;
    const parsedScore = score && parseStockfishScore(score);

    useEffect(() => {
        if (!score) return;

        if (score.type === "mate") {
            setWhiteHeight(score.value > 0 ? 8 : 0);
            return;
        }

        const scoreUnits = calculateScoreUnits(score);

        setWhiteHeight(scoreUnits);
    }, [score]);

    return (
        <div className={styles.scoremeter} title={parsedScore}>
            <div
                className={styles.whitescore}
                data-testid="whitescore"
                style={{ "--score-units": whiteHeight } as React.CSSProperties}
            ></div>
        </div>
    );
};

export default ScoreMeter;
