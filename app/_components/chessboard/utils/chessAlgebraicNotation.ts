import { AlgebraicPiece, File, Pieces } from "@/app/types";
import { MovesTreeNode } from "./MovesTree";
import {
    pieceToAlgebraicPiece,
    positionToAlgebraicNotation,
    xToFile,
} from "@/app/utils";

export const getAlgebraicMove = (fullMove: MovesTreeNode) => {
    const prevBoard = fullMove.parent.board;
    const [y, x] = fullMove.to;
    const piece = prevBoard[y][x];

    const take = piece === Pieces.EMPTY ? "" : "x";
    const mate = fullMove.isMate() ? "#" : "";
    const check = fullMove.isCheck() && !mate ? "+" : "";

    let algebraicPiece: AlgebraicPiece | File = pieceToAlgebraicPiece(
        fullMove.piece
    );
    if (algebraicPiece === "" && take) {
        algebraicPiece = xToFile(fullMove.from[1]);
    }

    const castle = fullMove.castled();
    if (castle) {
        if (castle === "short") {
            return `0-0${check}${mate}`;
        }
        return `0-0-0${check}${mate}`;
    }

    const endPosition = positionToAlgebraicNotation(fullMove.to);
    const promotedTo = fullMove.promotedTo();
    const extraPrecision = fullMove.getPrecisePosition();

    return `${algebraicPiece}${extraPrecision}${take}${endPosition}${promotedTo ? `=${promotedTo}` : ""}${check}${mate}`;
};
