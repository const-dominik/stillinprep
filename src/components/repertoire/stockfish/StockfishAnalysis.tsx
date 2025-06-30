"use client";

import { updateRepertoireField } from "@/lib/actions/repertoire";
import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import { useStockfishContext } from "@/lib/context/stockfish/StockfishContext";
import useChange from "@/lib/hooks/useChange";
import DepthControl from "./DepthControl";
import { parseStockfishResponse, parseStockfishScore } from "./logic";
import styles from "./styles/StockfishAnalysis.module.scss";

const StockfishAnalysis = () => {
    const { id: repertoireId } = useRepertoire();
    const { multiPV, setDepth, depth } = useStockfishContext();
    const { currentNode } = usePosition();

    useChange(() => {
        updateRepertoireField(repertoireId, "depth", String(depth));
    }, [depth, repertoireId]);

    const currentStockfishLines = multiPV.filter(
        (node) =>
            node.nodeId === currentNode.getMoveHash() &&
            node.line.pv &&
            node.line.pv[0]
    );

    return (
        <div className={styles["stockfish-lines"]}>
            <div className={styles["stockfish-title"]}>Best moves</div>

            <div className={styles["stockfish-lines-list"]}>
                {currentStockfishLines.map((analysisNode, index) => (
                    <div className={styles["stockfish-line"]} key={index}>
                        <div className={styles["stockfish-score"]}>
                            {parseStockfishScore(analysisNode.line.score!)}
                        </div>
                        <div className={styles["stockfish-move"]}>
                            {parseStockfishResponse(
                                analysisNode.line.pv![0],
                                currentNode.board
                            )}
                        </div>
                    </div>
                ))}
                {!currentStockfishLines.length && <div>Calculating...</div>}
            </div>

            <DepthControl setDepth={setDepth} depth={depth} />
        </div>
    );
};

export default StockfishAnalysis;
