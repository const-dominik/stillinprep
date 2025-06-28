import { IconType } from "react-icons";
import { MovesTreeNode } from "./components/repertoire/utils/MovesTree";
import { Pieces } from "./types/types";
import type {
    AlgebraicPosition,
    Chessboard,
    PiecePosition,
    Player,
    Rank,
    File,
    AlgebraicPiece,
    MoveType,
    TimeControl,
    LiDbAvgRating,
    LiDbRating,
} from "./types/types";

import { GiSupersonicBullet } from "react-icons/gi";
import { GiSilverBullet } from "react-icons/gi";
import { GiTurtle } from "react-icons/gi";
import { GiPaperPlane } from "react-icons/gi";
import { ImFire } from "react-icons/im";
import { LuRabbit } from "react-icons/lu";

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

export const whitePromotionPieces = [
    Pieces.WHITE_KNIGHT,
    Pieces.WHITE_BISHOP,
    Pieces.WHITE_ROOK,
    Pieces.WHITE_QUEEN,
];

export const blackPromotionPieces = [
    Pieces.BLACK_KNIGHT,
    Pieces.BLACK_BISHOP,
    Pieces.BLACK_ROOK,
    Pieces.BLACK_QUEEN,
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

export const fileAndRankToPosition = (algebraicMove: string): PiecePosition => {
    if (algebraicMove.length !== 2) {
        throw new Error("File and rank should be 2 chars.");
    }
    const [file, rank] = [...algebraicMove];

    const files = "abcdefgh";

    return [8 - Number(rank), files.indexOf(file)];
};

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

const charToPieceMap: Record<string, Pieces> = {
    p: Pieces.BLACK_PAWN,
    r: Pieces.BLACK_ROOK,
    n: Pieces.BLACK_KNIGHT,
    b: Pieces.BLACK_BISHOP,
    q: Pieces.BLACK_QUEEN,
    k: Pieces.BLACK_KING,
    P: Pieces.WHITE_PAWN,
    R: Pieces.WHITE_ROOK,
    N: Pieces.WHITE_KNIGHT,
    B: Pieces.WHITE_BISHOP,
    Q: Pieces.WHITE_QUEEN,
    K: Pieces.WHITE_KING,
};

const pieceToCharMap = {
    ...Object.fromEntries(
        Object.entries(charToPieceMap).map(([key, value]) => [value, key])
    ),
    [Pieces.EMPTY]: "",
} as Record<Pieces, string>;

export const FENToChessboard = (fen: string): Chessboard => {
    const rows = fen.split(" ")[0].split("/");

    const board = rows.map((rank) => {
        const row: Pieces[] = [];

        for (const char of rank) {
            if (/\d/.test(char)) {
                const emptySquares = parseInt(char, 10);
                row.push(...Array(emptySquares).fill(Pieces.EMPTY));
            } else {
                row.push(charToPieceMap[char] ?? Pieces.EMPTY);
            }
        }

        if (row.length !== 8) {
            throw new Error(`Invalid FEN row: "${rank}"`);
        }

        return row;
    });

    if (board.length !== 8) {
        throw new Error("FEN must describe 8 ranks.");
    }

    return board;
};

export const chessboardToFEN = (board: Chessboard): string => {
    if (board.length !== 8 || board.some((row) => row.length !== 8)) {
        throw new Error("Invalid board: must be 8x8.");
    }

    const fenRows = board.map((row) => {
        let fenRow = "";
        let emptyCount = 0;

        for (const piece of row) {
            if (piece === Pieces.EMPTY) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fenRow += emptyCount;
                    emptyCount = 0;
                }
                fenRow += pieceToCharMap[piece] || "";
            }
        }

        if (emptyCount > 0) {
            fenRow += emptyCount;
        }

        return fenRow;
    });

    return fenRows.join("/");
};

export const moveToMoveHistory = (
    move: MovesTreeNode,
    separator: string = " "
): string => {
    const moves = [];
    const promotedTo = move.promotedTo();

    while (move.piece !== Pieces.EMPTY) {
        moves.push(
            `${positionToAlgebraicNotation(move.from)}${positionToAlgebraicNotation(move.to)}${promotedTo ? promotedTo[1].toLowerCase() : ""}`
        );
        move = move.parent;
    }

    return moves.toReversed().join(separator);
};

export const getTreeLeaves = (root: MovesTreeNode): string[] => {
    if (root.children.length === 0) return [root.getMoveHash()];

    const leaves = root.children.map(getTreeLeaves);

    return leaves.flat();
};

export const timeControlToIcon: Record<TimeControl, IconType> = {
    ultraBullet: GiSupersonicBullet,
    bullet: GiSilverBullet,
    blitz: ImFire,
    rapid: LuRabbit,
    classical: GiTurtle,
    correspondence: GiPaperPlane,
} as const;

export const liRatingsAvgs: LiDbAvgRating[] = [
    500, 1100, 1300, 1500, 1700, 1900, 2100, 2300,
] as const;

export const liRatings: LiDbRating[] = [
    0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500,
] as const;

export const liTimeControls: TimeControl[] = [
    "ultraBullet",
    "bullet",
    "blitz",
    "rapid",
    "classical",
    "correspondence",
] as const;

export const avgRatingsToRatings: Record<LiDbAvgRating, LiDbRating[]> = {
    500: [0],
    1100: [1000],
    1300: [1200],
    1500: [1400],
    1700: [1600],
    1900: [1800],
    2100: [2000],
    2300: [2200, 2500],
};

export const toggleArrayItem = <T>(item: T, arr: T[]): T[] => {
    if (arr.includes(item)) {
        return arr.filter((i) => i !== item);
    }
    return [...arr, item];
};
