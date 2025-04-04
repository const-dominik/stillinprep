"use client";

import { MovesTreeNode } from "./utils/MovesTree";
import styles from "./styles.module.scss";
import { getAlgebraicMove } from "./utils/chessAlgebraicNotation";
import { Dispatch, SetStateAction } from "react";

const MoveHistory = ({
    currentNode,
    setCurrentNode,
}: {
    currentNode: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
}) => {
    const allMoves = currentNode.getAllMoves();

    const groupedMoves: {
        moveNumber: number;
        whiteMove: MovesTreeNode;
        blackMove?: MovesTreeNode;
    }[] = [];

    let moveNumber = 1;
    for (let i = 0; i < allMoves.length; i += 2) {
        groupedMoves.push({
            moveNumber,
            whiteMove: allMoves[i],
            blackMove: allMoves[i + 1],
        });
        moveNumber++;
    }

    return (
        <div className={styles["sidebar-scroll-wrapper"]}>
            <div className={styles["sidebar"]}>
                <div className={styles["move-history"]}>
                    {groupedMoves.map(
                        ({ moveNumber, whiteMove, blackMove }) => (
                            <div
                                key={moveNumber}
                                className={styles["move-pair"]}
                            >
                                <span className={styles["move-number"]}>
                                    {moveNumber}
                                </span>
                                <Move
                                    move={whiteMove}
                                    setCurrentNode={setCurrentNode}
                                />
                                {blackMove && (
                                    <Move
                                        move={blackMove}
                                        setCurrentNode={setCurrentNode}
                                    />
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const Move = ({
    move,
    setCurrentNode,
}: {
    move: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
}) => (
    <div
        className={styles.move}
        key={`${move.moveId}${move.player}`}
        onClick={() => setCurrentNode(move)}
    >
        {getAlgebraicMove(move)}
    </div>
);

export default MoveHistory;
