import { MovesTreeNode } from "@/components/utils/MovesTree";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import { useStockfish } from "@/lib/hooks/useStockfish";
import { PositionContextValue, StockfishAPI } from "@/lib/types/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { useDebounce } from "use-debounce";

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
