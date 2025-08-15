import MoveItem from "@/components/repertoire/movepopularity/MoveItem";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TestProviders } from "../../../../testing_utils";

describe("MoveItem", () => {
    const mockMove = {
        uci: "",
        san: "e4",
        averageRating: 500,
        white: 1000,
        black: 500,
        draws: 500,
    };

    it("renders move info correctly", () => {
        render(
            <TestProviders>
                <MoveItem move={mockMove} totalGames={5000} />
            </TestProviders>
        );

        expect(screen.getByText("e4")).toBeInTheDocument();
        expect(screen.getByText("40.00%")).toBeInTheDocument();
        expect(screen.getByText("2,000")).toBeInTheDocument();
    });
});
