"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { Dispatch, SetStateAction } from "react";
import { getGroupedMoves } from "./logic";
import Move from "./Move";
import SavedLines from "./SavedLines";
import styles from "./styles/MoveHistory.module.scss";
import TreeNavigator from "./TreeNavigator";

const MoveHistory = ({
    currentNode,
    lastNode,
    setCurrentNode,
    setLastNode,
    repertoireId,
}: {
    currentNode: MovesTreeNode;
    lastNode: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
    setLastNode: Dispatch<SetStateAction<MovesTreeNode>>;
    repertoireId: string;
}) => {
    const groupedMoves = getGroupedMoves(lastNode);

    const setLine = (node: MovesTreeNode) => {
        let lastNode = node;
        while (lastNode.children.length === 1) {
            lastNode = lastNode.children[0];
        }
        setLastNode(lastNode);
        setCurrentNode(node);
    };

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
                                        setLine={setLine}
                                        setLastNode={setLastNode}
                                        repertoireId={repertoireId}
                                    />
                                    {blackMove && (
                                        <Move
                                            move={blackMove}
                                            currentNode={currentNode}
                                            setCurrentNode={setCurrentNode}
                                            setLine={setLine}
                                            setLastNode={setLastNode}
                                            repertoireId={repertoireId}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
                <TreeNavigator
                    currentNode={currentNode}
                    lastNode={lastNode}
                    setCurrentNode={setCurrentNode}
                />
            </div>
            <SavedLines
                currentNode={currentNode}
                lastNode={lastNode}
                setLine={setLine}
            />
        </div>
    );
};

export default MoveHistory;
