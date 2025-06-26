import { create_e4_d5_exd5 } from "@/__tests__/testing_utils";
import StockfishAnalysis from "@/app/_components/chessboard/StockfishAnalysis";
import { useStockfish } from "@/app/_components/chessboard/utils/hooks/useStockfish";
import { render, renderHook, screen } from "@testing-library/react";

describe("Stockfish component", () => {
    it("loads", async () => {
        const [e4] = create_e4_d5_exd5();
        const { result } = renderHook(() => useStockfish(e4));
        expect(result.current).toBeDefined();
        render(
            <StockfishAnalysis stockfish={result.current} currentNode={e4} />
        );

        expect(
            screen.queryByText("Depth affects engine performance!")
        ).not.toBeNull();
        expect(screen.queryByText("Best moves:")).not.toBeNull();
    });
});
