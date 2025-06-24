"use client";

import { MovesTreeNode } from "./utils/MovesTree";
import styles from "./styles.module.scss";
import { parseStockfishResponse, parseStockfishScore } from "./utils/stockfish";
import { StockfishAPI } from "@/app/types/types";

const StockfishAnalysis = ({
    stockfish,
    currentNode,
}: {
    stockfish: StockfishAPI;
    currentNode: MovesTreeNode;
}) => {
    const { multiPV, setDepth, depth } = stockfish;

    return (
        <div className={styles["stockfish-lines"]}>
            <div className={styles["stockfish-title"]}>Best moves:</div>

            <div className={styles["stockfish-lines-list"]}>
                {multiPV
                    .filter(
                        (node) =>
                            node.nodeId === currentNode.getMoveHash() &&
                            node.line.pv &&
                            node.line.pv[0]
                    )
                    .map((analysisNode, index) => (
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
