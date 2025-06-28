import { create_e4_d5_exd5 } from "@/__tests__/testing_utils";
import StockfishAnalysis from "@/app/components/repertoire/StockfishAnalysis";
import { useStockfish } from "@/app/hooks/useStockfish";
import { render, renderHook, screen } from "@testing-library/react";

describe("Stockfish component", () => {
    afterEach(() => {
        jest.clearAllTimers();
    });
    it("loads", async () => {
        const [e4] = create_e4_d5_exd5();
        const { result, unmount } = renderHook(() => useStockfish(e4, 15));
        expect(result.current).toBeDefined();
        render(
            <StockfishAnalysis
                stockfish={result.current}
                currentNode={e4}
                repertoireId="test"
            />
        );

        expect(
            screen.queryByText("Depth affects engine performance!")
        ).not.toBeNull();
        expect(screen.queryByText("Best moves")).not.toBeNull();
        result.current.terminate();
        unmount();
    });
});
