/**
 * @jest-environment jsdom
 */

import Move from "@/components/repertoire/history/Move";
import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { create_e4_e5_Nf3, TestProviders } from "../../../testing_utils";

jest.mock("@/lib/actions/move", () => ({
    manageLeaves: jest.fn(),
}));

describe("Move component", () => {
    it("renders the algebraic notation of the move", () => {
        const [e4] = create_e4_e5_Nf3();
        render(
            <Move
                move={e4}
                currentNode={e4}
                setCurrentNode={() => {}}
                setLine={() => {}}
                setLastNode={() => {}}
                repertoireId=""
            />,
            { wrapper: TestProviders }
        );

        expect(screen.getByText("e4")).toBeInTheDocument();
    });

    it("highlights current move", () => {
        const [e4] = create_e4_e5_Nf3();
        render(
            <Move
                move={e4}
                currentNode={e4}
                setCurrentNode={() => {}}
                setLine={() => {}}
                setLastNode={() => {}}
                repertoireId=""
            />,
            { wrapper: TestProviders }
        );
        const moveElement = screen.getByText(e4.getAlgebraicNotation());

        expect(moveElement.className).toContain("current-move");
    });

    it("calls setCurrentNode on click", () => {
        const setCurrentNode = jest.fn();
        const [e4] = create_e4_e5_Nf3();
        render(
            <Move
                move={e4}
                currentNode={e4}
                setCurrentNode={setCurrentNode}
                setLine={() => {}}
                setLastNode={() => {}}
                repertoireId=""
            />,
            { wrapper: TestProviders }
        );

        const moveElement = screen.getByText(e4.getAlgebraicNotation());
        fireEvent.click(moveElement);

        expect(setCurrentNode).toHaveBeenCalledWith(e4);
    });

    it("shows a cross on hover", () => {
        const [e4] = create_e4_e5_Nf3();

        render(
            <Move
                move={e4}
                currentNode={e4}
                setCurrentNode={() => {}}
                setLine={() => {}}
                setLastNode={() => {}}
                repertoireId=""
            />,
            { wrapper: TestProviders }
        );

        const moveElement = screen.getByText("e4");
        expect(moveElement).toBeInTheDocument();
        expect(screen.queryByText("X")).not.toBeInTheDocument();

        fireEvent.mouseEnter(moveElement);
        expect(screen.queryByText("X")).toBeInTheDocument();

        fireEvent.mouseLeave(moveElement);
        expect(screen.queryByText("X")).not.toBeInTheDocument();
    });

    it("displays modal and tries to remove line when cross is clicked", async () => {
        const [e4, e5] = create_e4_e5_Nf3();
        const setLastNode = jest.fn();
        const setLine = jest.fn();
        const setCurrentNode = jest.fn();
        render(
            <Move
                move={e5}
                currentNode={e5}
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
                setLine={setLine}
                repertoireId="rep123"
            />,
            { wrapper: TestProviders }
        );

        const moveElement = screen.getByText("e5");
        fireEvent.mouseEnter(moveElement);

        const cross = screen.getByText("X");
        expect(cross).toBeInTheDocument();

        fireEvent.click(cross);
        expect(
            await screen.findByText(
                "Are you sure? This is irreversible and will cut this line up to e4."
            )
        ).toBeInTheDocument();

        const yes = await screen.findByText("Yes");
        fireEvent.click(yes);

        await waitFor(() => {
            expect(setLine).toHaveBeenCalledWith(e4);
            expect(setLastNode).not.toHaveBeenCalled();
        });
    });
});
