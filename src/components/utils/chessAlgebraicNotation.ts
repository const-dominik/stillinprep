import {
    AlgebraicPiece,
    AlgebraicPosition,
    BoardFile,
    PiecePosition,
    Pieces,
} from "@/lib/types/types";
import { xToFile, yToRank } from "@/lib/utils";
import { MovesTreeNode } from "./MovesTree";

export const positionToAlgebraicNotation = ([
    y,
    x,
]: PiecePosition): AlgebraicPosition => `${xToFile(x)}${yToRank(y)}`;

const pieceToAlgebraicPiece = (piece: Pieces): AlgebraicPiece => {
    if ([Pieces.EMPTY, Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(piece)) {
        return "";
    }
    if ([Pieces.BLACK_KNIGHT, Pieces.WHITE_KNIGHT].includes(piece)) {
        return "N";
    }
    if ([Pieces.BLACK_BISHOP, Pieces.WHITE_BISHOP].includes(piece)) {
        return "B";
    }
    if ([Pieces.BLACK_ROOK, Pieces.WHITE_ROOK].includes(piece)) {
        return "R";
    }
    if ([Pieces.BLACK_QUEEN, Pieces.WHITE_QUEEN].includes(piece)) {
        return "Q";
    }
    return "K";
};

export const getAlgebraicMove = (fullMove: MovesTreeNode) => {
    if (fullMove.piece === Pieces.EMPTY) {
        return "root";
    }

    const prevBoard = fullMove.parent.board;
    const [y, x] = fullMove.to;
    const takenPiece = prevBoard[y][x];
    const piece = fullMove.board[y][x];

    let take = takenPiece === Pieces.EMPTY ? "" : "x";
    if (
        [Pieces.BLACK_PAWN, Pieces.WHITE_PAWN].includes(piece) &&
        fullMove.from[1] !== fullMove.to[1] &&
        takenPiece === Pieces.EMPTY
    ) {
        take = "x";
    }

    const mate = fullMove.isMate() ? "#" : "";
    const check = fullMove.isCheck() && !mate ? "+" : "";
    const promotedTo = fullMove.promotedTo();

    let algebraicPiece: AlgebraicPiece | BoardFile = pieceToAlgebraicPiece(
        promotedTo ? promotedTo[0] : fullMove.piece
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
    const extraPrecision = fullMove.getPrecisePosition();

    return `${algebraicPiece}${extraPrecision}${take}${endPosition}${promotedTo ? `=${promotedTo[1]}` : ""}${check}${mate}`;
};
