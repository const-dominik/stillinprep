import * as TestingProviders from "./test_providers";

jest.mock("@/lib/context/current-position/PositionContext", () => {
    const originalModule = jest.requireActual(
        "@/lib/context/current-position/PositionContext"
    );
    return {
        __esModule: true,
        ...originalModule,
        usePosition: () => TestingProviders.useMockPosition(),
    };
});

jest.mock("@/lib/context/stockfish/StockfishContext", () => {
    const originalModule = jest.requireActual(
        "@/lib/context/stockfish/StockfishContext"
    );
    return {
        __esModule: true,
        ...originalModule,
        useStockfishContext: () => TestingProviders.useMockStockfish(),
    };
});
