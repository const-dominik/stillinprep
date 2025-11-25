// organize-imports-ignore
import "@testing-library/jest-dom";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import MovePopularity from "@/components/repertoire/movepopularity/MovePopularity";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/components/repertoire/movepopularity/logic", () => ({
    getPopularMoves: jest.fn(),
    calculateMoveStats: jest.fn(() => ({
        totalGamesForMove: 10,
        percentage: 50,
    })),
}));

// jest.fn();
import { getPopularMoves } from "@/components/repertoire/movepopularity/logic";
import { TestProviders } from "../../../utils";
import { MovePopualritySettings } from "@/lib/types/types";

const mockGetPopularMoves = getPopularMoves as jest.Mock;

const mockNode: MovesTreeNode = new MovesTreeNode();

const movePopularitySettings: MovePopualritySettings = {
    timeControls: ["bullet", "blitz", "rapid"],
    ratings: [1500, 1700],
};

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
            <TestProviders current={mockNode}>
                <MovePopularity
                    settings={movePopularitySettings}
                    setSettings={jest.fn()}
                />
            </TestProviders>
        );

        expect(screen.getByText("Popular moves")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("King's Pawn")).toBeInTheDocument();
            expect(screen.getByText("e5")).toBeInTheDocument();
            expect(screen.getByText("40.00%")).toBeInTheDocument();
        });
    });

    it("can toggle to Masters DB", async () => {
        render(
            <TestProviders current={mockNode}>
                <MovePopularity
                    settings={movePopularitySettings}
                    setSettings={jest.fn()}
                />
            </TestProviders>
        );

        const mastersButton = screen.getByText("Masters");
        fireEvent.click(mastersButton);

        await waitFor(() => {
            expect(mockGetPopularMoves).toHaveBeenCalledWith(
                "masters",
                expect.anything(),
                expect.anything()
            );
        });
    });

    it("toggles settings when clicking gear icon", async () => {
        render(
            <TestProviders current={mockNode}>
                <MovePopularity
                    settings={movePopularitySettings}
                    setSettings={jest.fn()}
                />
            </TestProviders>
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
            <TestProviders current={mockNode}>
                <MovePopularity
                    settings={movePopularitySettings}
                    setSettings={jest.fn()}
                />
            </TestProviders>
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
