import { MovesTreeNode } from "@/components/utils/MovesTree";
import { addMove } from "@/lib/actions/move";
import {
    PendingPromotion,
    PiecePosition,
    Pieces,
    Player,
} from "@/lib/types/types";
import { blackPromotionPieces, whitePromotionPieces } from "@/lib/utils";
import styles from "../styles/Square.module.scss";

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

export const getSquareClasses = (
    isDark: boolean,
    promoting: boolean,
    isChoosable: boolean,
    isMoveLegal: boolean,
    isPieceOnSquare: boolean,
    isChecked: boolean,
    isOver: boolean,
    isSelected: boolean
) => {
    const classes: string[] = [];

    classes.push(isDark ? styles.dark : styles.light);

    if (!promoting || isChoosable) {
        classes.push(styles.pointer);
    }

    if (isMoveLegal) {
        if (isPieceOnSquare) {
            classes.push(
                isDark
                    ? styles["under-attack-dark"]
                    : styles["under-attack-light"]
            );
        } else {
            classes.push(
                isDark ? styles["legal-dark-move"] : styles["legal-light-move"]
            );
        }
    }

    if (isChecked) {
        classes.push(isDark ? styles["checked-dark"] : styles["checked-light"]);
    }

    if (isOver && isMoveLegal) {
        classes.push(
            isPieceOnSquare ? styles["hovered-attacked"] : styles["hovered"]
        );
    }

    if (isSelected) {
        classes.push(styles.selected);
    }

    return classes;
};

export const getPromotionSquares = (
    pendingPromotion: PendingPromotion,
    currentPlayer: Player
): [PiecePosition, Pieces][] => {
    if (!pendingPromotion) return [];
    const [y, x] = pendingPromotion.to;
    const pieces =
        currentPlayer === "white" ? whitePromotionPieces : blackPromotionPieces;
    const dir = currentPlayer === "white" ? 1 : -1;
    return pieces.toReversed().map((piece, i) => [[y + i * dir, x], piece]);
};
