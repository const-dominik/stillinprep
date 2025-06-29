import { MovesTreeNode } from "@/components/utils/MovesTree";
import { useCallback, useEffect } from "react";
import styles from "./styles/TreeNavigator.module.scss";

const TreeNavigator = ({
    currentNode,
    lastNode,
    setCurrentNode,
}: {
    currentNode: MovesTreeNode;
    lastNode: MovesTreeNode;
    setCurrentNode: (node: MovesTreeNode) => void;
}) => {
    const moveLeft = useCallback(() => {
        if (currentNode !== currentNode.parent) {
            setCurrentNode(currentNode.parent);
        }
    }, [currentNode, setCurrentNode]);

    const moveRight = useCallback(() => {
        if (currentNode.children.length === 0 || currentNode === lastNode)
            return;
        let currentNextMove = lastNode;
        while (currentNextMove.parent !== currentNode) {
            currentNextMove = currentNextMove.parent;
        }
        setCurrentNode(currentNextMove);
    }, [currentNode, setCurrentNode, lastNode]);

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
        <div className={styles["tree-navigator"]}>
            <div className={styles["arrow"]} onClick={() => moveLeft()}>
                ←
            </div>
            <div className={styles["arrow"]} onClick={() => moveRight()}>
                →
            </div>
        </div>
    );
};

export default TreeNavigator;
