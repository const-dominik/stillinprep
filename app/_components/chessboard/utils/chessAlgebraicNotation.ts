import {
    AlgebraicPiece,
    AlgebraicPosition,
    File,
    PiecePosition,
    Pieces,
    Rank,
} from "@/app/types";
import { MovesTreeNode } from "./MovesTree";

export const xToFile = (x: number): File => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

    return files[x];
};

export const yToRank = (y: number): Rank => {
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1] as const;

    return ranks[y];
};

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
    const prevBoard = fullMove.parent.board;
    const [y, x] = fullMove.to;
    const piece = prevBoard[y][x];

    const take = piece === Pieces.EMPTY ? "" : "x";
    const mate = fullMove.isMate() ? "#" : "";
    const check = fullMove.isCheck() && !mate ? "+" : "";
    const promotedTo = fullMove.promotedTo();

    let algebraicPiece: AlgebraicPiece | File = pieceToAlgebraicPiece(
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
