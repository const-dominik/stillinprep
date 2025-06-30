import { MovesTreeNode } from "@/components/utils/MovesTree";
import { manageLeaves } from "@/lib/actions/move";
import { useConfirm } from "@/lib/context/confirm/ConfirmContext";
import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import { getTreeLeaves } from "@/lib/utils";
import { MouseEvent, useState } from "react";
import styles from "./styles/Move.module.scss";

const Move = ({
    move,
    setLine,
}: {
    move: MovesTreeNode;
    setLine: (node: MovesTreeNode) => void;
}) => {
    const { currentNode, setLastNode, setCurrentNode } = usePosition();
    const { id: repertoireId } = useRepertoire();
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
