import { Pieces } from "@/lib/types/types";
import {
    FENToChessboard,
    chessboardToFEN,
    copyBoard,
    getTreeLeaves,
    initialBoard,
    moveToMoveHistory,
    positionToAlgebraicNotation,
} from "@/lib/utils";
import { create_e4_d5_exd5 } from "../../testing_utils";

describe("Utility functions:", () => {
    it("copyBoard creates deep copy of board", () => {
        expect(copyBoard(initialBoard)).not.toBe(initialBoard);
        expect(copyBoard(initialBoard)).toEqual(initialBoard);
    });

    it("positionToAlgebraicNotation return proper square", () => {
        expect(positionToAlgebraicNotation([0, 1])).toEqual("b8");
        expect(positionToAlgebraicNotation([1, 1])).toEqual("b7");
        expect(positionToAlgebraicNotation([2, 3])).toEqual("d6");
        expect(positionToAlgebraicNotation([3, 4])).toEqual("e5");
        expect(positionToAlgebraicNotation([4, 1])).toEqual("b4");
        expect(positionToAlgebraicNotation([5, 7])).toEqual("h3");
        expect(positionToAlgebraicNotation([6, 2])).toEqual("c2");
        expect(positionToAlgebraicNotation([7, 7])).toEqual("h1");
    });

    it("FENToChessboard returns correct board", () => {
        const board = FENToChessboard(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        );
        expect(board).toEqual(initialBoard);
    });

    it("chessboardTOFEN returns correct FEN", () => {
        expect(chessboardToFEN(initialBoard)).toEqual(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        );
    });

    it("moveToMoveHistory returns correct move history", () => {
        const [e4, d5, exd5] = create_e4_d5_exd5();
        expect(moveToMoveHistory(e4)).toEqual("e2e4");
        expect(moveToMoveHistory(d5)).toEqual("e2e4 d7d5");
        expect(moveToMoveHistory(exd5)).toEqual("e2e4 d7d5 e4d5");
    });

    it("getTreeLeaves return the leaves ids", () => {
        const [e4, d5, exd5] = create_e4_d5_exd5();
        expect(getTreeLeaves(e4)).toEqual([exd5.getMoveHash()]);
        expect(getTreeLeaves(d5)).toEqual([exd5.getMoveHash()]);
        expect(getTreeLeaves(exd5)).toEqual([exd5.getMoveHash()]);

        const { node: d4 } = e4.addMove(
            Pieces.WHITE_PAWN,
            [6, 3],
            [4, 3],
            FENToChessboard("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR")
        );

        expect(getTreeLeaves(e4)).toEqual([
            exd5.getMoveHash(),
            d4.getMoveHash(),
        ]);
        expect(getTreeLeaves(d5)).toEqual([exd5.getMoveHash()]);
        expect(getTreeLeaves(exd5)).toEqual([exd5.getMoveHash()]);
    });
});
