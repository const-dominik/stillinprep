import { Pieces } from "./types";
import type { Chessboard, MoveType, PiecePosition, Player } from "./types";

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

export const kingMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

export const knightMoves: PiecePosition[] = [
    [-2, -1],
    [-2, 1],
    [2, -1],
    [2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
];

export const bishopMoves: PiecePosition[] = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
];

export const rookMoves: PiecePosition[] = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
];

export const copyBoard = (board: Chessboard) => board.map((row) => [...row]);
export const getCurrentPlayerPieces = (player: Player) => {
    if (player === "white") return whitePieces;
    return blackPieces;
};
export const includesMove = (
    moves: [PiecePosition, MoveType][],
    moveToCheck: PiecePosition
): boolean => {
    return moves.some(
        ([pos]) => pos[0] === moveToCheck[0] && pos[1] === moveToCheck[1]
    );
};

export const getOppositePlayer = (player: Player): Player => {
    return player === "white" ? "black" : "white";
};
