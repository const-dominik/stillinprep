import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";
import { Chessboard, Pieces } from "@/app/types";

const pieceMap: Record<string, Pieces> = {
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

export const FENToChessboard = (fen: string): Chessboard => {
    const rows = fen.split(" ")[0].split("/");

    const board = rows.map((rank) => {
        const row: Pieces[] = [];

        for (const char of rank) {
            if (/\d/.test(char)) {
                const emptySquares = parseInt(char, 10);
                row.push(...Array(emptySquares).fill(Pieces.EMPTY));
            } else {
                row.push(pieceMap[char] ?? Pieces.EMPTY);
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

export const create_e4_e5_Nf3 = () => {
    const root = new MovesTreeNode();
    const e4 = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const e5 = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 4],
        [3, 4],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const Nf3 = e5.addMove(
        Pieces.WHITE_KNIGHT,
        [7, 6],
        [5, 5],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R")
    );

    return [e4, e5, Nf3];
};

export const create_e4_d5_exd5 = () => {
    const root = new MovesTreeNode();
    const e4 = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const d5 = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 3],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const exd5 = d5.addMove(
        Pieces.WHITE_PAWN,
        [4, 4],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR")
    );

    return [e4, d5, exd5];
};
