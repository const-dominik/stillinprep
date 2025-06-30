/**
 * @jest-environment jsdom
 */

import MoveHistory from "@/components/repertoire/history/MoveHistory";
import { Pieces } from "@/lib/types/types";
import { FENToChessboard } from "@/lib/utils";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { create_e4_e5_Nf3, TestProviders } from "../../../testing_utils";

describe("Move history", () => {
    it("displays all played moves", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();

        render(
            <TestProviders current={Nf3} last={Nf3}>
                <MoveHistory />,
            </TestProviders>
        );

        const e4_text = screen.queryByText(e4.getAlgebraicNotation());
        const e5_text = screen.queryByText(e5.getAlgebraicNotation());
        const Nf3_text = screen.queryByText(Nf3.getAlgebraicNotation());

        expect(e4_text).toBeInTheDocument();
        expect(e5_text).toBeInTheDocument();
        expect(Nf3_text).toBeInTheDocument();
    });

    it("groups moves", () => {
        const [, e5, Nf3] = create_e4_e5_Nf3();

        const { container } = render(
            <TestProviders current={Nf3} last={Nf3}>
                <MoveHistory />,
            </TestProviders>
        );
        let pairs = Array.from(container.querySelectorAll(".move-pair"));

        expect(pairs).toBeDefined();
        expect(pairs.length).toEqual(2);

        const { container: newContainer } = render(
            <TestProviders current={e5} last={e5}>
                <MoveHistory />,
            </TestProviders>
        );
        pairs = Array.from(newContainer.querySelectorAll(".move-pair"));

        expect(pairs.length).toEqual(1);
    });

    it("changes line on click", () => {
        const [, e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={Nf3}
                last={Nf3}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <MoveHistory />,
            </TestProviders>
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
            <TestProviders
                current={e5}
                last={Nf3}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <MoveHistory />,
            </TestProviders>
        );

        const rightArrow = screen.getByText("→");
        fireEvent.click(rightArrow);

        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);

        const leftArrow = screen.getByText("←");
        fireEvent.click(leftArrow);

        expect(setCurrentNode).toHaveBeenCalledWith(e4);
    });

    it("doesn't change line when we're on the tree edges (right)", () => {
        const [e4] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={e4}
                last={e4}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <MoveHistory />,
            </TestProviders>
        );

        const rightArrow = screen.getByText("→");
        fireEvent.click(rightArrow);

        expect(setCurrentNode).not.toHaveBeenCalled();
        expect(setLastNode).not.toHaveBeenCalled();
    });

    it("doesn't change line when we're on the tree edges (left)", () => {
        const [e4] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={e4.parent}
                last={e4}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <MoveHistory />,
            </TestProviders>
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
            <TestProviders
                current={e5}
                last={Nf3}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <MoveHistory />,
            </TestProviders>
        );

        fireEvent.keyDown(document, { key: "ArrowLeft" });

        expect(setCurrentNode).toHaveBeenCalledWith(e4);

        fireEvent.keyDown(document, { key: "ArrowRight" });
        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);
    });

    it("doesn't show saved lines when there is none", () => {
        const [, , Nf3] = create_e4_e5_Nf3();

        render(
            <TestProviders current={Nf3} last={Nf3}>
                <MoveHistory />,
            </TestProviders>
        );
        const saved = screen.queryByText("Other lines:");

        expect(saved).not.toBeInTheDocument();
    });

    it("renders saved lines if more than one child", () => {
        const [e5, Nf3] = create_e4_e5_Nf3();
        const { node: Nc3 } = e5.addMove(
            Pieces.WHITE_KNIGHT,
            [7, 1],
            [5, 2],
            FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR")
        );

        render(
            <TestProviders current={e5} last={Nf3}>
                <MoveHistory />,
            </TestProviders>
        );

        const saved = screen.getByText("Saved lines:");
        const Nc3Element = screen.getByText(Nc3.getAlgebraicNotation());

        expect(saved).toBeDefined();
        expect(Nc3Element).toBeDefined();
    });

    it("changes state when clicking saved lines", () => {
        const [e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        const { node: Nc3 } = e5.addMove(
            Pieces.WHITE_KNIGHT,
            [7, 1],
            [5, 2],
            FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR")
        );

        const { node: d6 } = Nc3.addMove(
            Pieces.BLACK_PAWN,
            [1, 3],
            [2, 3],
            FENToChessboard(
                "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR"
            )
        );

        render(
            <TestProviders
                current={e5}
                last={Nf3}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <MoveHistory />,
            </TestProviders>
        );

        const Nc3Element = screen.getByText(Nc3.getAlgebraicNotation());
        fireEvent.click(Nc3Element);

        expect(setCurrentNode).toHaveBeenCalledWith(Nc3);
        expect(setLastNode).toHaveBeenCalledWith(d6);
    });
});
