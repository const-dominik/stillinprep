"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { updateRepertoireField } from "@/lib/actions/repertoire";
import useChange from "@/lib/hooks/useChange";
import { StockfishAPI } from "@/lib/types/types";
import DepthControl from "./DepthControl";
import { parseStockfishResponse, parseStockfishScore } from "./logic";
import styles from "./styles/StockfishAnalysis.module.scss";
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

            <DepthControl setDepth={setDepth} depth={depth} />
        </div>
    );
};

export default StockfishAnalysis;
