import { MovesTreeNode } from "@/components/utils/MovesTree";
import { manageLeaves } from "@/lib/actions/move";
import { useConfirm } from "@/lib/context/confirm/ConfirmContext";
import { getTreeLeaves } from "@/lib/utils";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import styles from "./styles/Move.module.scss";

const Move = ({
    move,
    currentNode,
    setCurrentNode,
    setLastNode,
    setLine,
    repertoireId,
}: {
    move: MovesTreeNode;
    currentNode: MovesTreeNode;
    setCurrentNode: Dispatch<SetStateAction<MovesTreeNode>>;
    setLastNode: Dispatch<SetStateAction<MovesTreeNode>>;
    setLine: (node: MovesTreeNode) => void;
    repertoireId: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const confirm = useConfirm();

    const isCurrentNode =
        move.moveId === currentNode.moveId &&
        move.player === currentNode.player;

    const classes = [styles["move"]];

    if (isCurrentNode) {
        classes.push(styles["current-move"]);
    }

    const handleDbRelations = (node: MovesTreeNode) => {
        if (node.children.length === 0) {
            manageLeaves(
                repertoireId,
                [node.getMoveHash()],
                node.parent.children.length > 1
                    ? undefined
                    : node.parent.getMoveHash()
            );
        } else {
            const leaves = getTreeLeaves(node);

            manageLeaves(repertoireId, leaves, node.parent.getMoveHash());
        }
    };

    const handleLineCut = async (e: MouseEvent) => {
        e.stopPropagation();

        const isSure = await confirm(
            `Are you sure? This is irreversible and will cut this line up to ${move.parent.getAlgebraicNotation()}.`
        );

        if (isSure) {
            handleDbRelations(move);

            move.parent.children = move.parent.children.filter(
                (node) => node !== move
            );
            if (currentNode.moveId >= move.parent.moveId) {
                setLine(move.parent);
            } else {
                setLastNode(move.parent);
            }
        }
    };

    return (
        <div
            className={classes.join(" ")}
            key={`${move.moveId}${move.player}`}
            onClick={() => setCurrentNode(move)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {move.getAlgebraicNotation()}
            {isHovered && (
                <div className={styles["cross"]} onClick={handleLineCut}>
                    X
                </div>
            )}
        </div>
    );
};

export default Move;
