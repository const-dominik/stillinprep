import Chessboard from "@/components/repertoire/chessboard/Chessboard";
import "@testing-library/jest-dom";

import { getSquareSelector, TestProviders } from "@/../__tests__/testing_utils";
import { MovesTreeNode } from "@/components/utils/MovesTree";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/actions/move");

describe("Chessboard", () => {
    it("renders the chessboard with the correct number of rows and columns", () => {
        const { container } = render(
            <TestProviders>
                <Chessboard />
            </TestProviders>
        );
        const rows = container.querySelectorAll("div[class*='row']");

        expect(rows).toHaveLength(8);

        rows.forEach((row) => {
            const darkSquares = row.querySelectorAll("div[class*='dark']");
            const lightSquares = row.querySelectorAll("div[class*='light']");

            expect(darkSquares).toHaveLength(4);
            expect(lightSquares).toHaveLength(4);
        });
    });

    it("allows the user to select and deselect a piece", async () => {
        const { container } = render(
            <TestProviders>
                <Chessboard />
            </TestProviders>
        );
        const e2 = container.querySelector(getSquareSelector([6, 4]))!;
        expect(e2).not.toBeNull();

        await userEvent.click(e2);

        expect(e2.className).toMatch(/selected/);

        await userEvent.click(e2);

        expect(e2.className).not.toMatch(/selected/);
    });

    it("moves a piece to a legal square", async () => {
        const root = new MovesTreeNode();
        const setCurrent = jest.fn();
        const setLast = jest.fn();
        // todo mock
        const { container } = render(
            <TestProviders
                current={root}
                mockSetRoot={setCurrent}
                mockSetLast={setLast}
            >
                <Chessboard />
            </TestProviders>
        );
        const e2 = container.querySelector(getSquareSelector([6, 4]))!;
        const e4 = container.querySelector(getSquareSelector([4, 4]))!;

        expect(e2).not.toBeNull();
        expect(e4).not.toBeNull();

        await userEvent.click(e2);
        await userEvent.click(e4);

        expect(setCurrent).toHaveBeenCalled();
        expect(setLast).toHaveBeenCalled();
    });

    it("does not move a piece to an illegal square", async () => {
        const setCurrent = jest.fn();
        const { container } = render(
            <TestProviders mockSetRoot={setCurrent}>
                <Chessboard />
            </TestProviders>
        );
        const e2 = container.querySelector(getSquareSelector([6, 4]))!;
        const a1 = container.querySelector(getSquareSelector([7, 0]))!;

        expect(e2).not.toBeNull();
        expect(a1).not.toBeNull();

        await userEvent.click(e2);

        expect(e2.className).toMatch(/selected/);

        await userEvent.click(a1);

        expect(setCurrent).not.toHaveBeenCalled();
    });

    it("does not allow selection of an opponent's piece", async () => {
        const { container } = render(
            <TestProviders>
                <Chessboard />
            </TestProviders>
        );
        const e7 = container.querySelector(getSquareSelector([1, 4]))!;

        await userEvent.click(e7);

        expect(e7.className).not.toMatch(/selected/);
    });
});
