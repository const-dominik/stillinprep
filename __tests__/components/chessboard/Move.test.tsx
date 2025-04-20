/**
 * @jest-environment jsdom
 */

import { create_e4_e5_Nf3 } from "@/__tests__/testing_utils";
import Move from "@/app/_components/chessboard/Move";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Move component", () => {
    it("renders the algebraic notation of the move", () => {
        const [e4] = create_e4_e5_Nf3();
        render(<Move move={e4} currentNode={e4} setCurrentNode={() => {}} />);

        expect(screen.getByText("e4")).toBeInTheDocument();
    });

    it("highlights current move", () => {
        const [e4] = create_e4_e5_Nf3();
        render(<Move move={e4} currentNode={e4} setCurrentNode={() => {}} />);
        const moveElement = screen.getByText(e4.getAlgebraicNotation());

        expect(moveElement.className).toContain("current-move");
    });

    it("calls setCurrentNode on click", () => {
        const setCurrentNode = jest.fn();
        const [e4] = create_e4_e5_Nf3();
        render(
            <Move move={e4} currentNode={e4} setCurrentNode={setCurrentNode} />
        );

        const moveElement = screen.getByText(e4.getAlgebraicNotation());
        fireEvent.click(moveElement);

        expect(setCurrentNode).toHaveBeenCalledWith(e4);
    });
});
