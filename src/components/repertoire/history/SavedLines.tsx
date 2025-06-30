import { getAlgebraicMove } from "@/components/utils/chessAlgebraicNotation";
import { MovesTreeNode } from "@/components/utils/MovesTree";

import { usePosition } from "@/lib/context/current-position/PositionContext";
import { getOtherSavedLines } from "./logic/index";
import styles from "./styles/SavedLines.module.scss";

const SavedLines = ({
    setLine,
}: {
    setLine: (node: MovesTreeNode) => void;
}) => {
    const { currentNode, lastNode } = usePosition();

    return (
        <div className={styles["saved-lines"]}>
            {currentNode.children.length > 1 && (
                <>
                    <p className={styles["saved-lines-header"]}>Saved lines:</p>
                    {getOtherSavedLines(currentNode, lastNode).map(
                        (node, index) => (
                            <div
                                className={styles["saved-line-move"]}
                                key={`${index}${node.player}${node.moveId}`}
                                onClick={() => setLine(node)}
                            >
                                {getAlgebraicMove(node)}
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default SavedLines;
