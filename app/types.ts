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
    BLACK_KING,
}

export type Chessboard = Pieces[][];
export type Player = "white" | "black";
export type PiecePosition = [y: number, x: number];
export type CastleType = "short" | "long";
export type CastlingRigths = "both" | "none" | CastleType;
export type Move = {
    from: PiecePosition;
    to: PiecePosition;
};

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type AlgebraicPiece = "" | "K" | "Q" | "N" | "B" | "R";
export type AlgebraicPromotionPieces = "Q" | "N" | "B" | "R";
export type AlgebraicPosition = `${File}${Rank}`;
