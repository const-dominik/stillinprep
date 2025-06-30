import { MovesTreeNode } from "@/components/utils/MovesTree";
import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import {
    RepertoireProvider,
    useRepertoire,
} from "@/lib/context/repertoire/RepertoireContext";
import { useStockfish } from "@/lib/hooks/useStockfish";
import {
    PiecePosition,
    Pieces,
    PositionContextValue,
    StockfishAPI,
} from "@/lib/types/types";
import { FENToChessboard } from "@/lib/utils";
import { ElementHandle, expect, Page } from "@playwright/test";
import { createContext, ReactNode, useContext, useState } from "react";
import { useDebounce } from "use-debounce";

export const create_e4_e5_Nf3 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: e5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 4],
        [3, 4],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: Nf3 } = e5.addMove(
        Pieces.WHITE_KNIGHT,
        [7, 6],
        [5, 5],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R")
    );

    return [e4, e5, Nf3];
};

export const create_e4_d5_exd5 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: d5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 3],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: exd5 } = d5.addMove(
        Pieces.WHITE_PAWN,
        [4, 4],
        [3, 3],
        FENToChessboard("rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR")
    );

    return [e4, d5, exd5];
};

const MockPositionContext = createContext<PositionContextValue | null>(null);
const MockStockfishContext = createContext<StockfishAPI | null>(null);

export const MockPositionProvider = ({
    children,
    root,
    last,
    mockSetRoot,
    mockSetLast,
}: {
    children: ReactNode;
    root: MovesTreeNode;
    last: MovesTreeNode;
    mockSetRoot?: typeof jest.fn;
    mockSetLast?: typeof jest.fn;
}) => {
    const [currentNode, setCurrentNode] = useState(root);
    const [lastNode, setLastNode] = useState(last);

    const setCurrent = mockSetRoot || setCurrentNode;
    const setLast = mockSetLast || setLastNode;

    return (
        <MockPositionContext.Provider
            value={{
                currentNode,
                setCurrentNode: setCurrent,
                lastNode,
                setLastNode: setLast,
            }}
        >
            {children}
        </MockPositionContext.Provider>
    );
};

export const MockStockfishProvider = ({
    children,
    currentNode,
}: {
    children: ReactNode;
    currentNode: MovesTreeNode;
}) => {
    const { depth } = useRepertoire();

    const [debouncedNode] = useDebounce(currentNode, 350);
    const stockfish = useStockfish(debouncedNode, depth);

    return (
        <MockStockfishContext value={stockfish}>
            {children}
        </MockStockfishContext>
    );
};

export const useMockPosition = () => {
    const ctx = useContext(MockPositionContext);
    if (!ctx)
        throw new Error(
            "useMockPosition must be used within MockPositionProvider"
        );
    return ctx;
};

export const useMockStockfish = () => {
    const ctx = useContext(MockStockfishContext);
    if (!ctx)
        throw new Error(
            "useMockStockfish must be used within MockPositionProvider"
        );
    return ctx;
};

export const TestProviders = ({
    children,
    current,
    last,
    mockSetRoot,
    mockSetLast,
}: {
    children: ReactNode;
    current?: MovesTreeNode;
    last?: MovesTreeNode;
    mockSetRoot?: typeof jest.fn;
    mockSetLast?: typeof jest.fn;
}) => {
    const mockRepertoireData = {
        ratings: "1900",
        timeControls: "rapid",
        depth: "15",
        paths: [],
    };

    const root = new MovesTreeNode();

    return (
        <ConfirmProvider>
            <RepertoireProvider
                repertoireData={mockRepertoireData}
                repertoireId={"test-id"}
            >
                <MockPositionProvider
                    root={current || root}
                    last={last || root}
                    mockSetRoot={mockSetRoot}
                    mockSetLast={mockSetLast}
                >
                    <MockStockfishProvider currentNode={current || root}>
                        {children}
                    </MockStockfishProvider>
                </MockPositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};

export const getSquareSelector = (position: PiecePosition) =>
    `div[class*="board"] div:nth-child(${position[0] + 1}) > div:nth-child(${position[1] + 1})`;

export const getSquareBySelector = async (
    page: Page,
    position: PiecePosition
): Promise<{
    square: ElementHandle<SVGElement | HTMLElement>;
    selector: string;
}> => {
    const selector = getSquareSelector(position);
    const square = await page.$(selector);

    expect(square).not.toBeNull();

    if (!square) {
        throw new Error("Square is null.");
    }

    return { square, selector };
};

export const getLocatorWithText = (
    classPart: string,
    text: string,
    page: Page
) => page.locator(`div[class*="${classPart}"] >> text=${text}`);
