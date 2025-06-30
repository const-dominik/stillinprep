import { create_e4_e5_Nf3, TestProviders } from "@/../__tests__/testing_utils";
import SavedLines from "@/components/repertoire/history/SavedLines";
import { Pieces } from "@/lib/types/types";
import { FENToChessboard } from "@/lib/utils";
import { fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Saved lines", () => {
    it("doesn't show saved lines when there is none", () => {
        const [, , Nf3] = create_e4_e5_Nf3();

        render(
            <TestProviders current={Nf3} last={Nf3}>
                <SavedLines setLine={() => {}} />,
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
                <SavedLines setLine={() => {}} />,
            </TestProviders>
        );

        const saved = screen.getByText("Saved lines:");
        const Nc3Element = screen.getByText(Nc3.getAlgebraicNotation());

        expect(saved).toBeDefined();
        expect(Nc3Element).toBeDefined();
    });

    it("changes state when clicking saved lines", () => {
        const [e5, Nf3] = create_e4_e5_Nf3();
        const setLine = jest.fn();

        const { node: Nc3 } = e5.addMove(
            Pieces.WHITE_KNIGHT,
            [7, 1],
            [5, 2],
            FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR")
        );

        Nc3.addMove(
            Pieces.BLACK_PAWN,
            [1, 3],
            [2, 3],
            FENToChessboard(
                "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR"
            )
        );

        render(
            <TestProviders current={e5} last={Nf3}>
                <SavedLines setLine={setLine} />,
            </TestProviders>
        );

        const Nc3Element = screen.getByText(Nc3.getAlgebraicNotation());
        fireEvent.click(Nc3Element);

        expect(setLine).toHaveBeenCalledWith(Nc3);
    });
});
