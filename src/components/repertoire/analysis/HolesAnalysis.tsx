import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import {
    ExplorerOptions,
    feedbackLine,
    MovePopualritySettings,
} from "@/lib/types/types";
import { avgRatingsToRatings } from "@/lib/utils";
import { useEffect, useState } from "react";
import styles from "./HolesAnalysis.module.scss";
import { getFeedback, getFraction } from "./logic";

const HolesAnalysis = ({ settings }: { settings: MovePopualritySettings }) => {
    const { timeControls, ratings } = settings;
    const { currentNode, setAnalysisNode } = usePosition();
    const { color } = useRepertoire();
    const [lines, setLines] = useState<feedbackLine[]>([
        { odds: "1/12", line: "14. e4 15. e6" },
    ]);

    const setFeedback = async () => {
        const explorerOptions: ExplorerOptions = {
            variant: "standard",
            fen: currentNode.getFEN(),
            speeds: timeControls,
            ratings: ratings.flatMap((rt) => avgRatingsToRatings[rt]),
            //database: "masters",
        };
        const feedback = await getFeedback(color, currentNode, explorerOptions);
        const newLines = feedback.map<feedbackLine>(([moves, odds]) => {
            return { odds: getFraction(odds), line: moves };
        });
        setLines(newLines.slice(0, 10));
    };
    useEffect(() => {
        setFeedback();
    }, []);
    const onClick = async () => {
        setAnalysisNode(currentNode);
        setFeedback();
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Repertoire analysis</div>
            <div className={styles.lines}>
                {lines.map((lineData) => (
                    <div
                        className={styles.line}
                        key={`${lineData.line}${lineData.odds}`}
                    >
                        <div>{lineData.odds} games</div>
                        <div>{lineData.line}</div>
                    </div>
                ))}
            </div>
            <div className={styles["reanalyse-button"]} onClick={onClick}>
                Re-analyse from current move
            </div>
        </div>
    );
};

export default HolesAnalysis;
