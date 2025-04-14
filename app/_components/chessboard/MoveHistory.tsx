"use client";

import { MovesTreeNode } from "./utils/MovesTree";
import styles from "./styles.module.scss";
import { getAlgebraicMove } from "./utils/chessAlgebraicNotation";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Pieces, type Move } from "@/app/types";

const MoveHistory = ({
    currentNode,
    setCurrentNode,
    lastNode,
    setLastNode,
}: {
    currentNode: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
    lastNode: MovesTreeNode;
    setLastNode: Dispatch<SetStateAction<MovesTreeNode>>;
}) => {
    const allMoves = lastNode.getAllMoves();

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

    const setLine = (node: MovesTreeNode) => {
        let lastNode = node;
        while (lastNode.children.length === 1) {
            lastNode = node.children[0];
        }
        setLastNode(lastNode);
        setCurrentNode(node);
    };

    const moveLeft = useCallback(() => {
        const prev = currentNode.parent;
        if (prev.piece !== Pieces.EMPTY) {
            setCurrentNode(prev);
        }
    }, [currentNode, setCurrentNode]);

    const moveRight = useCallback(() => {
        if (currentNode.children.length === 0) return;
        const next = currentNode.children[0];
        setCurrentNode(next);
    }, [currentNode, setCurrentNode]);

    const getOtherSavedLines = (node: MovesTreeNode) => {
        let currentNextMove = lastNode;
        while (currentNextMove.parent !== node) {
            currentNextMove = currentNextMove.parent;
        }
        console.log(currentNextMove);
        return node.children.filter((child) => child !== currentNextMove);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                moveLeft();
            } else if (event.key === "ArrowRight") {
                moveRight();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [moveLeft, moveRight]);

    return (
        <div className={styles["history-container"]}>
            <div className={styles["move-history"]}>
                <div className={styles["sidebar-scroll-wrapper"]}>
                    <div className={styles["sidebar"]}>
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
                                        currentNode={currentNode}
                                        setCurrentNode={setCurrentNode}
                                    />
                                    {blackMove && (
                                        <Move
                                            move={blackMove}
                                            currentNode={currentNode}
                                            setCurrentNode={setCurrentNode}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className={styles["tree-navigator"]}>
                    <div className={styles["arrow"]} onClick={() => moveLeft()}>
                        ←
                    </div>
                    <div
                        className={styles["arrow"]}
                        onClick={() => moveRight()}
                    >
                        →
                    </div>
                </div>
            </div>
            <div className={styles["saved-lines"]}>
                {currentNode.children.length > 1 && (
                    <>
                        <p className={styles["saved-lines-header"]}>
                            Other lines:
                        </p>
                        {getOtherSavedLines(currentNode).map((node, index) => (
                            <div
                                className={styles["saved-line-move"]}
                                key={`${index}${node.player}${node.moveId}`}
                                onClick={() => setLine(node)}
                            >
                                {getAlgebraicMove(node)}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

const Move = ({
    move,
    currentNode,
    setCurrentNode,
}: {
    move: MovesTreeNode;
    currentNode: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
}) => {
    const isCurrentNode =
        move.moveId === currentNode.moveId &&
        move.player === currentNode.player;

    const classes = [styles.move];

    if (isCurrentNode) {
        classes.push(styles["current-move"]);
    }

    return (
        <div
            className={classes.join(" ")}
            key={`${move.moveId}${move.player}`}
            onClick={() => setCurrentNode(move)}
        >
            {getAlgebraicMove(move)}
        </div>
    );
};
export default MoveHistory;
