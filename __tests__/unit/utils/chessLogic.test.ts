/**
 * @jest-environment node
 */

import { getLegalMoves, isKingChecked } from "@/components/utils/chessLogic";
import { MovesTreeNode } from "@/components/utils/MovesTree";
import { Pieces } from "@/lib/types/types";
import { FENToChessboard } from "@/lib/utils";

describe("chessLogic", () => {
    describe("check detection", () => {
        it("should detect no check", () => {
            expect(
                isKingChecked(
                    FENToChessboard(
                        "r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R"
                    )
                )
            ).toEqual([]);
            expect(
                isKingChecked(
                    FENToChessboard(
                        "r2qr1k1/3n1pb1/pp1p1np1/3Pp2p/2P5/1N2BP2/PP1QB1PP/4RR1K"
                    )
                )
            ).toEqual([]);
            expect(
                isKingChecked(FENToChessboard("k7/2Q5/1K6/8/8/8/8/8"))
            ).toEqual([]);
            expect(
                isKingChecked(
                    FENToChessboard("1k1n3r/3R4/1K6/2B1N3/1R3Q2/1Q6/8/8")
                )
            ).toEqual([]);
        });

        it("should detect check on white king", () => {
            expect(
                isKingChecked(
                    FENToChessboard(
                        "r3kbnr/pp1n1pp1/2p1p2p/q6P/3P1B2/3Q1NN1/PPP2PP1/R3K2R"
                    )
                )
            ).toEqual([6]);
            expect(
                isKingChecked(
                    FENToChessboard(
                        "r1bqk1nr/pppp1ppp/2n5/8/1b1PP3/5N2/PP3PPP/RNBQKB1R"
                    )
                )
            ).toEqual([6]);
            expect(
                isKingChecked(FENToChessboard("8/5k2/8/8/7b/2K4r/8/8"))
            ).toEqual([6]);
            expect(
                isKingChecked(FENToChessboard("8/5k2/3b4/3n4/8/2K5/8/8"))
            ).toEqual([6]);
        });

        it("should detect check on black king", () => {
            expect(
                isKingChecked(
                    FENToChessboard(
                        "r1bqk2r/pppp1Bpp/2n2n2/2b1p1N1/4P3/8/PPPP1PPP/RNBQK2R"
                    )
                )
            ).toEqual([12]);
            expect(
                isKingChecked(
                    FENToChessboard(
                        "r1b1kb1r/ppNp1ppp/1q1P1nn1/8/5P2/8/PPP3PP/R1BQKB1R"
                    )
                )
            ).toEqual([12]);
            expect(
                isKingChecked(FENToChessboard("8/2k5/8/8/2K2B2/5B2/8/8"))
            ).toEqual([12]);
            expect(
                isKingChecked(FENToChessboard("8/2k5/8/3N4/3K4/3B4/8/8"))
            ).toEqual([12]);
        });
    });

    describe("gets correct legal moves list", () => {
        describe("get correct moves in starting position", () => {
            const root = new MovesTreeNode();
            it("gets no moves for empty squares and black pieces", () => {
                expect(getLegalMoves(root, [4, 5])).toEqual([]);
                expect(getLegalMoves(root, [2, 3])).toEqual([]);
                expect(getLegalMoves(root, [1, 0])).toEqual([]);
                expect(getLegalMoves(root, [0, 1])).toEqual([]);
            });
            it("gets no moves for blocked white pieces", () => {
                expect(getLegalMoves(root, [7, 0])).toEqual([]);
                expect(getLegalMoves(root, [7, 5])).toEqual([]);
                expect(getLegalMoves(root, [7, 4])).toEqual([]);
                expect(getLegalMoves(root, [7, 3])).toEqual([]);
            });
            it("gets correct moves for white pawns and knight", () => {
                expect(getLegalMoves(root, [6, 3]).sort()).toEqual(
                    [
                        [[5, 3], "normal"],
                        [[4, 3], "normal"],
                    ].sort()
                );
                expect(getLegalMoves(root, [7, 6])).toEqual(
                    [
                        [[5, 7], "normal"],
                        [[5, 5], "normal"],
                    ].sort()
                );
            });
        });
        describe("get correct moves after e4", () => {
            const root = new MovesTreeNode();
            const { node: e4 } = root.addMove(
                Pieces.WHITE_PAWN,
                [6, 4],
                [4, 4],
                FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
            );
            it("gets no moves for blocked white pieces", () => {
                expect(getLegalMoves(e4, [0, 0])).toEqual([]);
                expect(getLegalMoves(e4, [0, 5])).toEqual([]);
                expect(getLegalMoves(e4, [0, 4])).toEqual([]);
                expect(getLegalMoves(e4, [0, 3])).toEqual([]);
            });
            it("gets correct moves for white pawns and knight", () => {
                expect(getLegalMoves(e4, [1, 4]).sort()).toEqual(
                    [
                        [[2, 4], "normal"],
                        [[3, 4], "normal"],
                    ].sort()
                );
                expect(getLegalMoves(e4, [0, 1])).toEqual(
                    [
                        [[2, 0], "normal"],
                        [[2, 2], "normal"],
                    ].sort()
                );
            });
        });
        // describe("gets corect moves for pined pieces", () => {
        //     it("Wade game: 1.e4 d6 2.Sf3 Gg4", () => {
        //         console.log(notationToChessTree("1.e4 d6 2.Nf3 Bg4"));
        //         expect(2).toEqual(2);
        //     });
        // });
    });

    it.todo("detects mate");
    it.todo("checks move legality");
});
