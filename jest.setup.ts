import * as TestingUtils from "./__tests__/testing_utils";

jest.mock("@/lib/context/current-position/PositionContext", () => {
    const originalModule = jest.requireActual(
        "@/lib/context/current-position/PositionContext"
    );
    return {
        __esModule: true,
        ...originalModule,
        usePosition: () => TestingUtils.useMockPosition(),
    };
});

jest.mock("@/lib/context/stockfish/StockfishContext", () => {
    const originalModule = jest.requireActual(
        "@/lib/context/stockfish/StockfishContext"
    );
    return {
        __esModule: true,
        ...originalModule,
        useStockfishContext: () => TestingUtils.useMockStockfish(),
    };
});
