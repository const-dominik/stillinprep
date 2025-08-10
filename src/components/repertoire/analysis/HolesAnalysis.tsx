import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import { useState } from "react";
import styles from "./HolesAnalysis.module.scss";

const HolesAnalysis = () => {
    const { currentNode, setAnalysisNode } = usePosition();
    const { timeControls, ratings } = useRepertoire();
    const [lines, setLines] = useState<{ odds: string; line: string }[]>([
        { odds: "1/12", line: "14. e4 15. e6" },
    ]);
    const onClick = () => {
        setAnalysisNode(currentNode);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Repertoire analysis</div>
            <div className={styles.lines}>
                {lines.map((lineData) => (
                    <div className={styles.line}>
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
