import { useStockfish } from "@/lib/hooks/useStockfish";
import { StockfishAPI } from "@/lib/types/types";
import { createContext, ReactNode, useContext } from "react";
import { useDebounce } from "use-debounce";
import { usePosition } from "../current-position/PositionContext";
import { useRepertoire } from "../repertoire/RepertoireContext";

const StockfishContext = createContext<StockfishAPI | null>(null);

export const StockfishProvider = ({ children }: { children: ReactNode }) => {
    const { currentNode } = usePosition();
    const { depth } = useRepertoire();

    const [debouncedNode] = useDebounce(currentNode, 350);
    const stockfish = useStockfish(debouncedNode, depth);

    return <StockfishContext value={stockfish}>{children}</StockfishContext>;
};

export const useStockfishContext = () => {
    const context = useContext(StockfishContext);

    if (!context) {
        throw new Error("Context is null!");
    }

    return context;
};
