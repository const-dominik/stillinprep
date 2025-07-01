/**
 * @jest-environment jsdom
 */

import Square from "@/components/repertoire/chessboard/Square";
import { Pieces, Player } from "@/lib/types/types";
import { pieceAssets } from "@/lib/utils";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Square component", () => {
    const baseProps = {
        x: 0,
        y: 0,
        piece: Pieces.EMPTY,
        currentPlayer: "black" as Player,
        isSelected: false,
        isMoveLegal: false,
        isPieceOnSquare: false,
        isChecked: false,
        promotionData: [false, false] as [boolean, boolean],
        onMouseDown: jest.fn(),
    };

    it("renders square with dark/light background depending on x+y", () => {
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                const { container, unmount } = render(
                    <Square {...baseProps} x={j} y={i} />
                );
                const square = container.querySelector("div")!;
                const img = container.querySelector("img");

                expect(square).toBeInTheDocument();
                expect(img).toBe(null);

                if ((i + j) % 2) {
                    expect(square.className).toContain("dark");
                } else {
                    expect(square.className).toContain("light");
                }

                unmount();
            }
        }
    });

    it('adds the "selected" class when isSelected is true', () => {
        const { container } = render(
            <Square {...baseProps} isSelected={true} />
        );
        const square = container.querySelector("div")!;

        expect(square).toBeInTheDocument();
        expect(square.className).toContain("selected");
    });

    it("adds legal move highlight when isMoveLegal is true and square is empty", () => {
        const { container, rerender } = render(
            <Square {...baseProps} isMoveLegal={true} />
        );
        let square = container.querySelector("div")!;

        expect(square).toBeInTheDocument();
        expect(square.className).toContain("legal-light-move");

        rerender(<Square {...baseProps} isMoveLegal={true} x={1} />);
        square = container.querySelector("div")!;

        expect(square).toBeInTheDocument();
        expect(square.className).toContain("legal-dark-move");

        rerender(<Square {...baseProps} />);

        square = container.querySelector("div")!;
        expect(square).toBeInTheDocument();
        expect(square.className).not.toContain("legal-dark-move");
        expect(square.className).not.toContain("legal-light-move");
    });

    it("adds under-attack class when isMoveLegal is true and square has a piece", () => {
        const { container, rerender } = render(
            <Square {...baseProps} isMoveLegal={true} isPieceOnSquare={true} />
        );
        let square = container.querySelector("div")!;

        expect(square).toBeInTheDocument();
        expect(square.className).toContain("under-attack-light");

        rerender(
            <Square
                {...baseProps}
                isMoveLegal={true}
                isPieceOnSquare={true}
                x={1}
            />
        );
        square = container.querySelector("div")!;

        expect(square).toBeInTheDocument();
        expect(square.className).toContain("under-attack-dark");

        rerender(<Square {...baseProps} />);

        square = container.querySelector("div")!;
        expect(square).toBeInTheDocument();
        expect(square.className).not.toContain("under-attack-light");
        expect(square.className).not.toContain("under-attack-dark");
    });

    it("renders the correct piece image when piece is not EMPTY", () => {
        const piece = Pieces.WHITE_PAWN;
        render(<Square {...baseProps} piece={Pieces.WHITE_PAWN} />);
        const img = screen.getByRole("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute(
            "src",
            expect.stringContaining(pieceAssets[piece])
        );
    });

    it("calls onMouseDown with correct coordinates when clicked", () => {
        const mockClick = jest.fn();
        const { container } = render(
            <Square {...baseProps} onMouseDown={mockClick} />
        );

        const square = container.querySelector("div")!;
        expect(square).toBeInTheDocument();
        fireEvent.mouseDown(square);
        expect(mockClick).toHaveBeenCalledWith(0, 0);
    });

    it("detects check", () => {
        const { container } = render(
            <Square {...baseProps} isChecked={true} />
        );

        const square = container.querySelector("div")!;
        expect(square).toBeInTheDocument();
        expect(square.className).toContain("checked");
    });

    it("renders overlay over square while promoting and isn't choosable", () => {
        const { container } = render(
            <Square {...baseProps} promotionData={[true, false]} />
        );

        const mainSquare = container.querySelector("div")!;
        const overlayDiv = mainSquare.querySelector("div");

        expect(overlayDiv).not.toBeNull();
        expect(overlayDiv).toBeInTheDocument();
    });

    it("doesn't render overlay over square while promoting and is choosable", () => {
        const { container } = render(
            <Square {...baseProps} promotionData={[true, true]} />
        );

        const mainSquare = container.querySelector("div")!;
        const overlayDiv = mainSquare.querySelector("div");

        expect(overlayDiv).toBeNull();
    });
});
