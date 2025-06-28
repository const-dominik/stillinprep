"use client";

import { MovesTreeNode } from "../../components/repertoire/utils/MovesTree";
import Chessboard from "../../components/repertoire/Chessboard";
import MoveHistory from "../../components/repertoire/MoveHistory";
import styles from "./page.module.scss";
import { useState } from "react";
import { z } from "zod";
import { MoveSchema } from "@/app/actions/schemas";
import { getBoardAfterMove } from "@/app/components/repertoire/utils/chessLogic";
import { LiDbAvgRating, Pieces, TimeControl } from "@/app/types/types";
import StockfishAnalysis from "@/app/components/repertoire/StockfishAnalysis";
import { useDebounce } from "use-debounce";
import { useStockfish } from "@/app/hooks/useStockfish";
import ScoreMeter from "@/app/components/repertoire/ScoreMeter";
import { ConfirmProvider } from "@/app/context/ConfirmContext";
import MovePopularity from "@/app/components/repertoire/MovePopularity";

type MoveNode = z.infer<typeof MoveSchema>;
type PathNodes = MoveNode["properties"][];

const mergePathsIntoTree = (segments: PathNodes[]) => {
    const root = new MovesTreeNode();
    let lastMove = root;
    let longest = 1;

    for (const path of segments) {
        let current = root;

        for (const move of path) {
            // TODO: proper move type and promotion piece
            const board = getBoardAfterMove(
                current.board,
                move.from,
                move.to,
                "normal",
                Pieces.EMPTY
            );
            const { node } = current.addMove(
                board[move.to[0]][move.to[1]],
                move.from,
                move.to,
                board
            );

            current = node;
        }

        if (path.length > longest) {
            lastMove = current;
            longest = path.length;
        }
    }

    return [root, lastMove];
};

const ChildComponent = ({
    repertoireId,
    segments,
    timeControls,
    ratings,
    depth,
}: {
    repertoireId: string;
    segments: PathNodes[];
    timeControls: TimeControl[];
    ratings: LiDbAvgRating[];
    depth: number;
}) => {
    const [root, last] = mergePathsIntoTree(segments);
    const [currentNode, setCurrentNode] = useState(root);
    const [lastNode, setLastNode] = useState(last);

    const [debouncedNode] = useDebounce(currentNode, 350);
    const stockfish = useStockfish(debouncedNode, depth);

    const score = stockfish.multiPV[0]?.line.score;

    return (
        <ConfirmProvider>
            <div className={styles.container}>
                <div className={styles["moves-info"]}>
                    <StockfishAnalysis
                        stockfish={stockfish}
                        currentNode={currentNode}
                        repertoireId={repertoireId}
                    />
                    <MovePopularity
                        currentNode={currentNode}
                        timeControls={timeControls}
                        ratings={ratings}
                        repertoireId={repertoireId}
                    />
                </div>
                <ScoreMeter score={score} />
                <Chessboard
                    currentNode={currentNode}
                    lastNode={lastNode}
                    setCurrentNode={setCurrentNode}
                    setLastNode={setLastNode}
                    repertoireId={repertoireId}
                />
                <MoveHistory
                    currentNode={currentNode}
                    lastNode={lastNode}
                    setCurrentNode={setCurrentNode}
                    setLastNode={setLastNode}
                    repertoireId={repertoireId}
                />
            </div>
        </ConfirmProvider>
    );
};

export default ChildComponent;
