import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";
import { Chessboard, Pieces } from "@/app/types";
import { FENToChessboard } from "@/app/utils";

export const create_e4_e5_Nf3 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: e5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 4],
        [3, 4],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: Nf3 } = e5.addMove(
        Pieces.WHITE_KNIGHT,
        [7, 6],
        [5, 5],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R")
    );

    return [e4, e5, Nf3];
};

export const create_e4_d5_exd5 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: d5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 3],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: exd5 } = d5.addMove(
        Pieces.WHITE_PAWN,
        [4, 4],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR")
    );

    return [e4, d5, exd5];
};
