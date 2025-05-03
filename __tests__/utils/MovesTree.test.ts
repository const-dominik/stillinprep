/**
 * @jest-environment node
 */

import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";
import { Pieces } from "@/app/types";
import { copyBoard, FENToChessboard, initialBoard } from "@/app/utils";
import { create_e4_e5_Nf3 } from "../testing_utils";

describe("MovesTreeNode", () => {
    it("initalizes to base values without arguments", () => {
        const root = new MovesTreeNode();

        expect(root.parent).toBe(root);
        expect(root.children).toHaveLength(0);
        expect(root.moveId).toBe(0);
        expect(root.player).toBe("black");
        expect(root.piece).toBe(Pieces.EMPTY);
        expect(root.from).toEqual([0, 0]);
        expect(root.to).toEqual([0, 0]);
        expect(root.board).toEqual(initialBoard);
    });

    it("constructor initializes values from arguments", () => {
        const board = copyBoard(initialBoard);
        board[6][4] = Pieces.EMPTY;
        board[4][4] = Pieces.WHITE_PAWN;

        const root = new MovesTreeNode(
            Pieces.WHITE_PAWN,
            [6, 4],
            [4, 4],
            FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
        );

        expect(root.piece).toBe(Pieces.WHITE_PAWN);
        expect(root.from).toEqual([6, 4]);
        expect(root.to).toEqual([4, 4]);
        expect(root.board).toEqual(board);
    });

    it("new child modifies node", () => {
        const root = new MovesTreeNode();
        // play e4
        const { node: newMove } = root.addMove(
            Pieces.WHITE_PAWN,
            [6, 4],
            [4, 4],
            FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
        );

        // board stays unchanged, child added
        expect(root.board).toEqual(initialBoard);
        expect(root.children).toEqual([newMove]);

        expect(newMove).toBeDefined();
        expect(newMove.moveId).toBe(root.moveId + 1);
        expect(newMove.player).toBe("white");

        // play d4
        const { node: d4 } = root.addMove(
            Pieces.WHITE_PAWN,
            [6, 3],
            [4, 3],
            FENToChessboard("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR")
        );

        expect(root.children).toEqual([newMove, d4]);
        expect(d4.moveId).toEqual(root.moveId + 1);
        expect(d4.player).toEqual("white");
    });

    it("getAllMoves returns list of all Moves", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();

        expect(Nf3.getAllMoves()).toEqual([e4, e5, Nf3]);
    });

    it.todo("return castling rights properly");
    it.todo("detects check");
    it.todo("detects mate");
});
