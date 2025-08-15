import { MovesTreeNode } from "@/components/utils/MovesTree";
import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import {
    ExplorerOptions,
    FeedbackLine,
    MovePopualritySettings,
} from "@/lib/types/types";
import { avgRatingsToRatings } from "@/lib/utils";
import { useEffect, useState } from "react";
import { setLineOnClick } from "../repertoire-utils";
import styles from "./HolesAnalysis.module.scss";
import { getFeedbackLines, getLastMove } from "./logic";

const HolesAnalysis = ({ settings }: { settings: MovePopualritySettings }) => {
    const { timeControls, ratings } = settings;
    const { currentNode, setAnalysisNode, setCurrentNode, setLastNode, root } =
        usePosition();
    const { id: repertoireId, color } = useRepertoire();
    const [lines, setLines] = useState<FeedbackLine[]>([]);

    const setFeedback = async (node: MovesTreeNode) => {
        const explorerOptions: ExplorerOptions = {
            variant: "standard",
            fen: node.getFEN(),
            speeds: timeControls,
            ratings: ratings.flatMap((rt) => avgRatingsToRatings[rt]),
        };
        const newLines = await getFeedbackLines(color, node, explorerOptions);
        setLines(newLines.slice(0, 10));
    };
    useEffect(() => {
        setFeedback(root);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClick = async () => {
        setAnalysisNode(currentNode);
        setFeedback(currentNode);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Repertoire analysis</div>
            <div className={styles.lines}>
                {lines.map((lineData) => (
                    <div
                        className={styles.line}
                        key={`${lineData.line}${lineData.odds}`}
                        onClick={() =>
                            setLineOnClick(
                                setCurrentNode,
                                setLastNode,
                                lineData.fromNode,
                                getLastMove(lineData.line),
                                repertoireId
                            )
                        }
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
