import { MovesTreeNode } from "@/components/utils/MovesTree";
import { addMove } from "@/lib/actions/move";

export const addMoveToDb = (node: MovesTreeNode, repertoireId: string) => {
    const parentId = node.parent.getMoveHash();
    const promotion = node.promotedTo();

    const currentMoveData = {
        name: node.getAlgebraicNotation(),
        from: node.from,
        to: node.to,
        promotion: promotion ? promotion[1] : null,
        id: node.getMoveHash(),
    };

    const moveData = {
        parent: parentId,
        repertoire: repertoireId,
        move: currentMoveData,
    };

    addMove(moveData);
};
