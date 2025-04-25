/**
 * @jest-environment node
 */

import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";
import { Pieces } from "@/app/types";
import {
    create_e4_d5_exd5,
    create_e4_e5_Nf3,
    FENToChessboard,
} from "../testing_utils";

describe("chessAlgebraicNotation", () => {
    it("works for simple moves", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();

        expect(e4.getAlgebraicNotation()).toEqual("e4");
        expect(e5.getAlgebraicNotation()).toEqual("e5");
        expect(Nf3.getAlgebraicNotation()).toEqual("Nf3");
    });

    it("works for takes", () => {
        const [, , exd5] = create_e4_d5_exd5();

        expect(exd5.getAlgebraicNotation()).toEqual("exd5");
    });

    it("displays proper piece in notation", () => {
        const [, , exd5] = create_e4_d5_exd5();

        const Qxd5 = exd5.addMove(
            Pieces.BLACK_QUEEN,
            [0, 3],
            [3, 3],
            FENToChessboard("rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR")
        );

        expect(Qxd5.getAlgebraicNotation()).toEqual("Qxd5");
    });

    it("works with piece precision", () => {
        const twoRooksCanMove = new MovesTreeNode(
            Pieces.WHITE_PAWN,
            [1, 1],
            [1, 3],
            FENToChessboard("8/8/8/1p6/8/2R1R3/8/8")
        );

        const rookMove = twoRooksCanMove.addMove(
            Pieces.WHITE_ROOK,
            [5, 2],
            [5, 3],
            FENToChessboard("8/8/8/1p6/8/3RR3/8/8")
        );

        expect(rookMove.getAlgebraicNotation()).toEqual("Rcd3");
    });

    it("detects check", () => {
        const [, , exd5] = create_e4_d5_exd5();

        const Qxd5 = exd5.addMove(
            Pieces.BLACK_QUEEN,
            [0, 3],
            [3, 3],
            FENToChessboard("rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR")
        );

        const a3 = Qxd5.addMove(
            Pieces.WHITE_PAWN,
            [6, 0],
            [4, 0],
            FENToChessboard("rnb1kbnr/ppp1pppp/8/3q4/8/P7/1PPP1PPP/RNBQKBNR")
        );

        const queenCheck = a3.addMove(
            Pieces.BLACK_QUEEN,
            [3, 3],
            [3, 4],
            FENToChessboard("rnb1kbnr/ppp1pppp/8/4q3/8/P7/1PPP1PPP/RNBQKBNR")
        );

        expect(queenCheck.getAlgebraicNotation()).toEqual("Qe5+");
    });

    it("detects mate", () => {
        const game = new MovesTreeNode(
            Pieces.WHITE_PAWN,
            [6, 2],
            [5, 2],
            FENToChessboard(
                "rnb1k1nr/ppp2ppp/4p3/2b5/1P3q2/P1P4P/3PNPP1/RNBQKB1R"
            )
        );

        const mate = game.addMove(
            Pieces.BLACK_QUEEN,
            [4, 5],
            [6, 5],
            FENToChessboard(
                "rnb1k1nr/ppp2ppp/4p3/2b5/1P6/P1P4P/3PNqP1/RNBQKB1R"
            )
        );

        expect(mate.getAlgebraicNotation()).toEqual("Qxf2#");
    });

    it("detects promotion", () => {
        const game = new MovesTreeNode(
            Pieces.BLACK_KING,
            [6, 0],
            [6, 1],
            FENToChessboard("8/5P2/8/8/8/8/1k1K4/8")
        );

        const promotion = game.addMove(
            Pieces.WHITE_PAWN,
            [1, 5],
            [0, 5],
            FENToChessboard("5Q2/8/8/8/8/8/1k1K4/8")
        );

        expect(promotion.getAlgebraicNotation()).toEqual("f8=Q");
    });

    it("works for complicated cases", () => {
        const game = new MovesTreeNode(
            Pieces.BLACK_KING,
            [1, 7],
            [0, 7],
            FENToChessboard("6rk/5P2/8/8/8/8/3K4/6R1")
        );

        const complicatedMove = game.addMove(
            Pieces.WHITE_PAWN,
            [1, 5],
            [0, 6],
            FENToChessboard("6Qk/8/8/8/8/8/3K4/6R1")
        );

        expect(complicatedMove.getAlgebraicNotation()).toEqual("fxg8=Q#");
    });

    it.todo("detects castle");
});
