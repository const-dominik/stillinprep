import { Dispatch, SetStateAction } from "react";
import { MovesTreeNode } from "./utils/MovesTree";
import styles from "./styles.module.scss";

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
            {move.getAlgebraicNotation()}
        </div>
    );
};

export default Move;
