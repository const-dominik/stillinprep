export const enum Pieces {
    EMPTY,

    WHITE_PAWN,
    WHITE_BISHOP,
    WHITE_KNIGHT,
    WHITE_ROOK,
    WHITE_QUEEN,
    WHITE_KING,

    BLACK_PAWN,
    BLACK_BISHOP,
    BLACK_KNIGHT,
    BLACK_ROOK,
    BLACK_QUEEN,
    BLACK_KING
}

export type Chessboard = Pieces[][];
export type Player = "white" | "black";
export type PiecePosition = [y: number, x: number];