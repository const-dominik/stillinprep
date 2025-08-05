"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { usePosition } from "@/lib/context/current-position/PositionContext";
import { getGroupedMoves } from "./logic";
import Move from "./Move";
import SavedLines from "./SavedLines";
import styles from "./styles/MoveHistory.module.scss";
import TreeNavigator from "./TreeNavigator";

const MoveHistory = (
    { mode }: { mode?: "regular" | "puzzle" } = { mode: "regular" }
) => {
    const { lastNode, setLastNode, setCurrentNode } = usePosition();

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
                                        setLine={setLine}
                                        mode={mode}
                                    />
                                    {blackMove && (
                                        <Move
                                            move={blackMove}
                                            setLine={setLine}
                                            mode={mode}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
                <TreeNavigator />
            </div>
            {!mode || (mode === "regular" && <SavedLines setLine={setLine} />)}
        </div>
    );
};

export default MoveHistory;
