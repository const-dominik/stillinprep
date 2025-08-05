"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { mergePathsIntoTree } from "@/components/utils/parseDbResponse";
import { PositionContextValue } from "@/lib/types/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { useRepertoire } from "../repertoire/RepertoireContext";

const PositionContext = createContext<PositionContextValue | null>(null);

export const PositionProvider = ({
    children,
    passedRoot,
    passedLast,
}: {
    children: ReactNode;
    passedRoot?: MovesTreeNode;
    passedLast?: MovesTreeNode;
}) => {
    let root: MovesTreeNode;
    let last: MovesTreeNode;

    const { paths } = useRepertoire();

    if (passedRoot && passedLast) {
        root = passedRoot;
        last = passedLast;
    } else {
        const [computedRoot, computedLast] = mergePathsIntoTree(paths);
        root = computedRoot;
        last = computedLast;
    }

    const [currentNode, setCurrentNode] = useState(last);
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
