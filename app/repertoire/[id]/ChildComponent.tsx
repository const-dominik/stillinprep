"use client";

import { MovesTreeNode } from "../../_components/chessboard/utils/MovesTree";
import Chessboard from "../../_components/chessboard/Chessboard";
import MoveHistory from "../../_components/chessboard/MoveHistory";
import styles from "./page.module.scss";
import { useState } from "react";
import { z } from "zod";
import { MoveSchema } from "@/app/actions/schemas";
import { getBoardAfterMove } from "@/app/_components/chessboard/utils/chessLogic";
import { Pieces } from "@/app/types/types";
import StockfishAnalysis from "@/app/_components/chessboard/StockfishAnalysis";
import { useDebounce } from "use-debounce";
import { useStockfish } from "@/app/_components/chessboard/utils/hooks/useStockfish";
import ScoreMeter from "@/app/_components/chessboard/ScoreMeter";

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
}: {
    repertoireId: string;
    segments: PathNodes[];
}) => {
    const [root, last] = mergePathsIntoTree(segments);
    const [currentNode, setCurrentNode] = useState(root);
    const [lastNode, setLastNode] = useState(last);

    const [debouncedNode] = useDebounce(currentNode, 300);
    const stockfish = useStockfish(debouncedNode);

    const score = stockfish.multiPV[0]?.line.score;

    return (
        <div className={styles.container}>
            <StockfishAnalysis
                stockfish={stockfish}
                currentNode={currentNode}
            />
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
            />
        </div>
    );
};

export default ChildComponent;
