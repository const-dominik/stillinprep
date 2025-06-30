/**
 * @jest-environment jsdom
 */

import { create_e4_e5_Nf3, TestProviders } from "@/../__tests__/testing_utils";
import MoveHistory from "@/components/repertoire/history/MoveHistory";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

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
});
