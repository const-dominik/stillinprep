import { mergePathsIntoTree } from "@/components/utils/parseDbResponse";
import { PositionContextValue } from "@/lib/types/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { useRepertoire } from "../repertoire/RepertoireContext";

const PositionContext = createContext<PositionContextValue | null>(null);

export const PositionProvider = ({ children }: { children: ReactNode }) => {
    const { paths } = useRepertoire();

    const [root, last] = mergePathsIntoTree(paths);

    const [currentNode, setCurrentNode] = useState(root);
    const [lastNode, setLastNode] = useState(last);

    return (
        <PositionContext.Provider
            value={{ currentNode, setCurrentNode, lastNode, setLastNode }}
        >
            {children}
        </PositionContext.Provider>
    );
};

export const usePosition = () => {
    const context = useContext(PositionContext);
    if (!context) {
        throw new Error("Context is null!");
    }

    return context;
};
