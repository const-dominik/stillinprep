"use client";

import { MovesTreeNode } from "./utils/MovesTree";
import styles from "./styles.module.scss";
import { parseStockfishResponse, parseStockfishScore } from "./utils/stockfish";
import { StockfishAPI } from "@/app/types/types";
import { updateRepertoireField } from "@/app/actions/repertoire";
import useChange from "@/app/hooks/useChange";

const StockfishAnalysis = ({
    stockfish,
    currentNode,
    repertoireId,
}: {
    stockfish: StockfishAPI;
    currentNode: MovesTreeNode;
    repertoireId: string;
}) => {
    const { multiPV, setDepth, depth } = stockfish;

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

            <div>
                <div className={styles["depth-controls"]}>
                    <div>Depth:</div>
                    <button onClick={() => setDepth(depth - 1)}>-</button>
                    <div className={styles["depth-display"]}>{depth}</div>
                    <button onClick={() => setDepth(depth + 1)}>+</button>
                </div>
                <div className={styles["depth-info"]}>
                    Depth affects engine performance!
                </div>
            </div>
        </div>
    );
};

export default StockfishAnalysis;
