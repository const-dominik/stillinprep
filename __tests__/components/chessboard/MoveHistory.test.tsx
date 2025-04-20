/**
 * @jest-environment jsdom
 */

import { create_e4_e5_Nf3, FENToChessboard } from "@/__tests__/testing_utils";
import MoveHistory from "@/app/_components/chessboard/MoveHistory";
import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";
import { Pieces } from "@/app/types";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Move history", () => {
    const node = new MovesTreeNode();
    const baseProps = {
        currentNode: node,
        lastNode: node,
        setCurrentNode: jest.fn(),
        setLastNode: jest.fn(),
    };

    it("displays all played moves", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();

        render(<MoveHistory {...baseProps} currentNode={Nf3} lastNode={Nf3} />);

        const e4_text = screen.queryByText(e4.getAlgebraicNotation());
        const e5_text = screen.queryByText(e5.getAlgebraicNotation());
        const Nf3_text = screen.queryByText(Nf3.getAlgebraicNotation());

        expect(e4_text).toBeInTheDocument();
        expect(e5_text).toBeInTheDocument();
        expect(Nf3_text).toBeInTheDocument();
    });

    it("groups moves", () => {
        const [, e5, Nf3] = create_e4_e5_Nf3();

        const { container, rerender } = render(
            <MoveHistory {...baseProps} currentNode={Nf3} lastNode={Nf3} />
        );
        let pairs = Array.from(container.querySelectorAll(".move-pair"));

        expect(pairs).toBeDefined();
        expect(pairs.length).toEqual(2);

        rerender(<MoveHistory {...baseProps} currentNode={e5} lastNode={e5} />);
        pairs = Array.from(container.querySelectorAll(".move-pair"));

        expect(pairs.length).toEqual(1);
    });

    it("changes line on click", () => {
        const [, e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <MoveHistory
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                currentNode={Nf3}
                lastNode={Nf3}
            />
        );

        const e5Element = screen.getByText(e5.getAlgebraicNotation());
        fireEvent.click(e5Element);

        expect(setCurrentNode).toHaveBeenCalledWith(e5);
        expect(setLastNode).not.toHaveBeenCalled();

        const Nf3Element = screen.getByText(Nf3.getAlgebraicNotation());
        fireEvent.click(Nf3Element);

        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);
        expect(setLastNode).not.toHaveBeenCalled();
    });

    it("changes line on arrow click", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <MoveHistory
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                currentNode={e5}
                lastNode={Nf3}
            />
        );

        const rightArrow = screen.getByText("→");
        fireEvent.click(rightArrow);

        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);

        const leftArrow = screen.getByText("←");
        fireEvent.click(leftArrow);

        expect(setCurrentNode).toHaveBeenCalledWith(e4);
    });

    it("doesn't change line when we're on the tree edges", () => {
        const [e4] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        const { rerender } = render(
            <MoveHistory
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                currentNode={e4}
                lastNode={e4}
            />
        );

        const rightArrow = screen.getByText("→");
        fireEvent.click(rightArrow);

        expect(setCurrentNode).not.toHaveBeenCalled();
        expect(setLastNode).not.toHaveBeenCalled();

        rerender(
            <MoveHistory
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                currentNode={e4.parent}
                lastNode={e4}
            />
        );

        const leftArrow = screen.getByText("←");
        fireEvent.click(leftArrow);

        expect(setCurrentNode).not.toHaveBeenCalled();
        expect(setLastNode).not.toHaveBeenCalled();
    });

    it("changes current node when using arrows", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <MoveHistory
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                currentNode={e5}
                lastNode={Nf3}
            />
        );

        fireEvent.keyDown(document, { key: "ArrowLeft" });

        expect(setCurrentNode).toHaveBeenCalledWith(e4);

        fireEvent.keyDown(document, { key: "ArrowRight" });
        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);
    });

    it("doesn't show saved lines when there is none", () => {
        const [, , Nf3] = create_e4_e5_Nf3();

        render(<MoveHistory {...baseProps} currentNode={Nf3} lastNode={Nf3} />);
        const saved = screen.queryByText("Other lines:");

        expect(saved).not.toBeInTheDocument();
    });

    it("renders saved lines if more than one child", () => {
        const [e5, Nf3] = create_e4_e5_Nf3();
        const Nc3 = e5.addMove(
            Pieces.WHITE_KNIGHT,
            [7, 1],
            [5, 2],
            FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR")
        );

        render(<MoveHistory {...baseProps} currentNode={e5} lastNode={Nf3} />);

        const saved = screen.getByText("Other lines:");
        const Nc3Element = screen.getByText(Nc3.getAlgebraicNotation());

        expect(saved).toBeDefined();
        expect(Nc3Element).toBeDefined();
    });

    it("changes state when clicking saved lines", () => {
        const [e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        const Nc3 = e5.addMove(
            Pieces.WHITE_KNIGHT,
            [7, 1],
            [5, 2],
            FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR")
        );

        const d6 = Nc3.addMove(
            Pieces.BLACK_PAWN,
            [1, 3],
            [2, 3],
            FENToChessboard(
                "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR"
            )
        );

        render(
            <MoveHistory
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                currentNode={e5}
                lastNode={Nf3}
            />
        );

        const Nc3Element = screen.getByText(Nc3.getAlgebraicNotation());
        fireEvent.click(Nc3Element);

        expect(setCurrentNode).toHaveBeenCalledWith(Nc3);
        expect(setLastNode).toHaveBeenCalledWith(d6);
    });
});
