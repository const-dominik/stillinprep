// organize-imports-ignore
import StockfishAnalysis from "@/components/repertoire/stockfish/StockfishAnalysis";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { getMockedStockfishAPI, TestProviders } from "../../../utils";

jest.mock("@/lib/context/stockfish/StockfishContext", () => {
    return {
        __esModule: true,
        useStockfishContext: jest.fn(),
    };
});
jest.mock("@/components/repertoire/stockfish/logic");

import { useStockfishContext } from "@/lib/context/stockfish/StockfishContext";
import {
    parseStockfishScore,
    parseStockfishResponse,
} from "@/components/repertoire/stockfish/logic";
import { MovesTreeNode } from "@/components/utils/MovesTree";

describe("Stockfish component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("displays basic info when no stockfish lines available", () => {
        (useStockfishContext as jest.Mock).mockReturnValue(
            getMockedStockfishAPI()
        );

        render(
            <TestProviders>
                <StockfishAnalysis />
            </TestProviders>
        );

        expect(screen.getByText("Best moves")).toBeInTheDocument();
        expect(screen.getByText("Calculating...")).toBeInTheDocument();
        expect(screen.getByText("Depth:")).toBeInTheDocument();
        expect(
            screen.getByText("Depth affects engine performance!")
        ).toBeInTheDocument();
    });

    it("displays stockfish analysis lines when available", () => {
        const root = new MovesTreeNode();
        const hash = root.getMoveHash();

        const mockMultiPV = [
            {
                nodeId: hash,
                line: {
                    pv: ["e2e4", "d7d5"],
                    score: { type: "cp", value: 125 },
                },
            },
            {
                nodeId: hash,
                line: {
                    pv: ["d2d4", "g8f6"],
                    score: { type: "cp", value: 85 },
                },
            },
        ];

        (useStockfishContext as jest.Mock).mockReturnValue({
            ...getMockedStockfishAPI(),
            multiPV: mockMultiPV,
        });

        (parseStockfishScore as jest.Mock)
            .mockReturnValueOnce("+1.25")
            .mockReturnValueOnce("+0.85");

        (parseStockfishResponse as jest.Mock)
            .mockReturnValueOnce("e4")
            .mockReturnValueOnce("d4");
        render(
            <TestProviders current={root}>
                <StockfishAnalysis />
            </TestProviders>
        );

        expect(screen.getByText("+1.25")).toBeInTheDocument();
        expect(screen.getByText("+0.85")).toBeInTheDocument();
        expect(screen.getByText("e4")).toBeInTheDocument();
        expect(screen.getByText("d4")).toBeInTheDocument();
        expect(screen.queryByText("Calculating...")).not.toBeInTheDocument();
    });

    it("filters out analysis lines that do not match current node", () => {
        const root = new MovesTreeNode();
        const hash = root.getMoveHash();

        const mockMultiPV = [
            {
                nodeId: hash,
                line: {
                    pv: ["e2e4", "d7d5"],
                    score: { type: "cp", value: 125 },
                },
            },
            {
                nodeId: "wrong hash",
                line: {
                    pv: ["d2d4", "g8f6"],
                    score: { type: "cp", value: 85 },
                },
            },
        ];

        (useStockfishContext as jest.Mock).mockReturnValue({
            ...getMockedStockfishAPI(),
            multiPV: mockMultiPV,
        });

        render(
            <TestProviders current={root}>
                <StockfishAnalysis />
            </TestProviders>
        );

        expect(parseStockfishScore).toHaveBeenCalledTimes(1);
        expect(parseStockfishResponse).toHaveBeenCalledTimes(1);
    });
});
