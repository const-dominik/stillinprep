import { MovesTreeNode } from "@/components/utils/MovesTree";
import { GroupedMoves } from "@/lib/types/types";

export const getOtherSavedLines = (
    node: MovesTreeNode,
    lastNode: MovesTreeNode
) => {
    let currentNextMove = lastNode;

    if (currentNextMove !== node) {
        while (currentNextMove.parent !== node) {
            currentNextMove = currentNextMove.parent;
        }
    }

    return node.children.filter((child) => child !== currentNextMove);
};

export const getGroupedMoves = (lastNode: MovesTreeNode): GroupedMoves => {
    const allMoves = lastNode.getAllMoves();

    const groupedMoves: GroupedMoves = [];

    let moveNumber = 1;
    for (let i = 0; i < allMoves.length; i += 2) {
        groupedMoves.push({
            moveNumber,
            whiteMove: allMoves[i],
            blackMove: allMoves[i + 1],
        });
        moveNumber++;
    }

    return groupedMoves;
};
