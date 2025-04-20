/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chessboard from "@/app/_components/chessboard/Chessboard";
import { MovesTreeNode } from "@/app/_components/chessboard/utils/MovesTree";

describe("Chessboard", () => {
    const baseProps = {
        currentNode: new MovesTreeNode(),
        setCurrentNode: jest.fn(),
        setLastNode: jest.fn(),
    };

    it("renders the chessboard with the correct number of rows and columns", () => {
        const { container } = render(<Chessboard {...baseProps} />);
        const rows = container.querySelectorAll("div[class*='row']");

        expect(rows).toHaveLength(8);

        rows.forEach((row) => {
            const darkSquares = row.querySelectorAll("div[class*='dark']");
            const lightSquares = row.querySelectorAll("div[class*='light']");

            expect(darkSquares).toHaveLength(4);
            expect(lightSquares).toHaveLength(4);
        });
    });
    it.todo("allows the user to select and deselect a piece");
    it.todo("moves a piece to a legal square");
    it.todo("does not move a piece to an illegal square");
    it.todo("updates the current node after a valid move");
    it.todo("performs castling when the conditions are met");
    it.todo("detects check and checkmate");
    it.todo("does not allow selection of an opponent's piece");
    it.todo("allows selecting and moving a piece");
    it.todo("updates rook and king positions during castling");
});
