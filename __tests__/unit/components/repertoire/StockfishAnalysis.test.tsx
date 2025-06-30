import StockfishAnalysis from "@/components/repertoire/stockfish/StockfishAnalysis";
import { useStockfish } from "@/lib/hooks/useStockfish";
import { render, renderHook, screen } from "@testing-library/react";
import { create_e4_d5_exd5, TestProviders } from "../../../testing_utils";

describe("Stockfish component", () => {
    afterEach(() => {
        jest.clearAllTimers();
    });
    it("loads", async () => {
        const [e4] = create_e4_d5_exd5();
        const { result, unmount } = renderHook(() => useStockfish(e4, 15));
        expect(result.current).toBeDefined();

        render(
            <TestProviders current={e4}>
                <StockfishAnalysis />
            </TestProviders>
        );

        expect(
            screen.queryByText("Depth affects engine performance!")
        ).not.toBeNull();
        expect(screen.queryByText("Best moves")).not.toBeNull();
        result.current.terminate();
        unmount();
    });
});
