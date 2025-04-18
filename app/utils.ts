import { Pieces } from "./types";
import type {
    AlgebraicPosition,
    Chessboard,
    PiecePosition,
    Player,
    Rank,
    File,
    AlgebraicPiece,
} from "./types";

export const initialBoard: Chessboard = [
    [
        Pieces.BLACK_ROOK,
        Pieces.BLACK_KNIGHT,
        Pieces.BLACK_BISHOP,
        Pieces.BLACK_QUEEN,
        Pieces.BLACK_KING,
        Pieces.BLACK_BISHOP,
        Pieces.BLACK_KNIGHT,
        Pieces.BLACK_ROOK,
    ],
    [
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
        Pieces.BLACK_PAWN,
    ],
    [
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
    ],
    [
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
    ],
    [
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
    ],
    [
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
        Pieces.EMPTY,
    ],
    [
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
        Pieces.WHITE_PAWN,
    ],
    [
        Pieces.WHITE_ROOK,
        Pieces.WHITE_KNIGHT,
        Pieces.WHITE_BISHOP,
        Pieces.WHITE_QUEEN,
        Pieces.WHITE_KING,
        Pieces.WHITE_BISHOP,
        Pieces.WHITE_KNIGHT,
        Pieces.WHITE_ROOK,
    ],
];

export const pieceAssets: Record<Exclude<Pieces, Pieces.EMPTY>, string> = {
    [Pieces.WHITE_PAWN]: "/pieces/wP.svg",
    [Pieces.WHITE_BISHOP]: "/pieces/wB.svg",
    [Pieces.WHITE_KNIGHT]: "/pieces/wN.svg",
    [Pieces.WHITE_ROOK]: "/pieces/wR.svg",
    [Pieces.WHITE_QUEEN]: "/pieces/wQ.svg",
    [Pieces.WHITE_KING]: "/pieces/wK.svg",

    [Pieces.BLACK_PAWN]: "/pieces/bP.svg",
    [Pieces.BLACK_BISHOP]: "/pieces/bB.svg",
    [Pieces.BLACK_KNIGHT]: "/pieces/bN.svg",
    [Pieces.BLACK_ROOK]: "/pieces/bR.svg",
    [Pieces.BLACK_QUEEN]: "/pieces/bQ.svg",
    [Pieces.BLACK_KING]: "/pieces/bK.svg",
};

export const whitePieces = [
    Pieces.WHITE_PAWN,
    Pieces.WHITE_KNIGHT,
    Pieces.WHITE_BISHOP,
    Pieces.WHITE_ROOK,
    Pieces.WHITE_QUEEN,
    Pieces.WHITE_KING,
];
export const blackPieces = [
    Pieces.BLACK_PAWN,
    Pieces.BLACK_KNIGHT,
    Pieces.BLACK_BISHOP,
    Pieces.BLACK_ROOK,
    Pieces.BLACK_QUEEN,
    Pieces.BLACK_KING,
];

export const copyBoard = (board: Chessboard) => board.map((row) => [...row]);
export const getCurrentPlayerPieces = (player: Player) => {
    if (player === "white") return whitePieces;
    return blackPieces;
};

export const getOppositePlayer = (player: Player): Player => {
    return player === "white" ? "black" : "white";
};

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

export const pieceToAlgebraicPiece = (piece: Pieces): AlgebraicPiece => {
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
