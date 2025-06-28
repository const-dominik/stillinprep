/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MovesTreeNode } from "@/app/components/repertoire/utils/MovesTree";
import MovePopularity from "@/app/components/repertoire/MovePopularity";
import "@testing-library/jest-dom";

jest.mock("@/app/components/repertoire/utils/movePopularity", () => ({
    getPopularMoves: jest.fn(),
}));

import { getPopularMoves } from "@/app/components/repertoire/utils/movePopularity";

const mockGetPopularMoves = getPopularMoves as jest.Mock;

const mockNode: MovesTreeNode = new MovesTreeNode();

const sampleResponse = {
    opening: { name: "King's Pawn" },
    moves: [
        {
            san: "e5",
            white: 40,
            black: 30,
            draws: 30,
        },
    ],
    white: 100,
    black: 100,
    draws: 100,
};

describe("MovePopularity component", () => {
    beforeEach(() => {
        mockGetPopularMoves.mockResolvedValue(sampleResponse);
    });

    it("renders title and loads popular moves", async () => {
        render(
            <MovePopularity
                currentNode={mockNode}
                repertoireId="rep1"
                ratings={[1900]}
                timeControls={["rapid"]}
            />
        );

        expect(screen.getByText("Popular moves")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("King's Pawn")).toBeInTheDocument();
            expect(screen.getByText("e5")).toBeInTheDocument();
            expect(screen.getByText("33.33%")).toBeInTheDocument();
        });
    });

    it("can toggle to Masters DB", async () => {
        render(
            <MovePopularity
                currentNode={mockNode}
                repertoireId="rep1"
                ratings={[1900]}
                timeControls={["rapid"]}
            />
        );

        const mastersButton = screen.getByText("Masters");
        fireEvent.click(mastersButton);

        await waitFor(() => {
            expect(mockGetPopularMoves).toHaveBeenCalledWith(
                "masters",
                expect.anything(),
                ""
            );
        });
    });

    it("toggles settings when clicking gear icon", async () => {
        render(
            <MovePopularity
                currentNode={mockNode}
                repertoireId="rep1"
                ratings={[1900]}
                timeControls={["rapid"]}
            />
        );

        await waitFor(() => screen.getByText("Players"));

        const gearIcon = screen.getByTestId("ci-settings-icon");
        fireEvent.click(gearIcon);

        await waitFor(() => {
            expect(
                screen.getByText("Include time controls:")
            ).toBeInTheDocument();
        });
    });

    it("displays fallback when no moves are found", async () => {
        mockGetPopularMoves.mockResolvedValueOnce({
            opening: { name: "Unknown" },
            moves: [],
            white: 0,
            black: 0,
            draws: 0,
        });

        render(
            <MovePopularity
                currentNode={mockNode}
                repertoireId="rep1"
                ratings={[1900]}
                timeControls={["rapid"]}
            />
        );

        await waitFor(() =>
            expect(
                screen.getByText(
                    "No results for this position. You might be making history!"
                )
            ).toBeInTheDocument()
        );
    });
});
