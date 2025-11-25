// organize-imports-ignore

import ScoreMeter from "@/components/repertoire/scoremeter/ScoreMeter";
import "@testing-library/jest-dom";

import { getMockedStockfishAPI, TestProviders } from "../../../utils";

import { render, screen } from "@testing-library/react";

jest.mock("@/lib/context/stockfish/StockfishContext", () => {
    return {
        __esModule: true,
        useStockfishContext: jest.fn(),
    };
});

jest.mock("@/components/repertoire/scoremeter/logic");
import { calculateScoreUnits } from "@/components/repertoire/scoremeter/logic";
import { useStockfishContext } from "@/lib/context/stockfish/StockfishContext";

describe("ScoreMeter", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("starts with default height of 4", () => {
        (useStockfishContext as jest.Mock).mockReturnValue({
            ...getMockedStockfishAPI(),
            multiPV: [undefined],
        });

        render(
            <TestProviders>
                <ScoreMeter />
            </TestProviders>
        );

        const whiteScore = screen.getByTestId("whitescore");

        expect(whiteScore).toHaveStyle("--score-units: 4");
    });

    it("updates height based on centipawn score", () => {
        (useStockfishContext as jest.Mock).mockReturnValue(
            getMockedStockfishAPI()
        );
        (calculateScoreUnits as jest.Mock).mockReturnValue(6);

        render(
            <TestProviders>
                <ScoreMeter />
            </TestProviders>
        );
        const whiteScore = screen.getByTestId("whitescore");

        expect(calculateScoreUnits).toHaveBeenCalledWith({
            type: "cp",
            value: 150,
        });

        expect(whiteScore).toHaveStyle("--score-units: 6");
    });

    it("sets height to 8 for positive mate scores", () => {
        (useStockfishContext as jest.Mock).mockReturnValue({
            ...getMockedStockfishAPI(),
            multiPV: [
                {
                    line: {
                        score: { type: "mate", value: 3 },
                    },
                    nodeId: "1234",
                },
            ],
        });
        render(
            <TestProviders>
                <ScoreMeter />
            </TestProviders>
        );
        const whiteScore = screen.getByTestId("whitescore");

        expect(whiteScore).toHaveStyle("--score-units: 8");
        expect(calculateScoreUnits).not.toHaveBeenCalled();
    });

    it("sets height to 0 for negative mate scores", () => {
        (useStockfishContext as jest.Mock).mockReturnValue({
            ...getMockedStockfishAPI(),
            multiPV: [
                {
                    line: {
                        score: { type: "mate", value: -2 },
                    },
                    nodeId: "1234",
                },
            ],
        });
        render(
            <TestProviders>
                <ScoreMeter />
            </TestProviders>
        );
        const whiteScore = screen.getByTestId("whitescore");

        expect(whiteScore).toHaveStyle("--score-units: 0");
        expect(calculateScoreUnits).not.toHaveBeenCalled();
    });

    it("does not update height when no score is available", () => {
        (useStockfishContext as jest.Mock).mockReturnValue({
            ...getMockedStockfishAPI(),
            multiPV: [],
        });

        render(<ScoreMeter />);
        const whiteScore = screen.getByTestId("whitescore");

        expect(whiteScore).toHaveStyle("--score-units: 4");
        expect(calculateScoreUnits).not.toHaveBeenCalled();
    });
});
