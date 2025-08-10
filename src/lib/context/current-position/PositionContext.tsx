"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { mergePathsIntoTree } from "@/components/utils/parseDbResponse";
import { PositionContextValue } from "@/lib/types/types";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
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
    let last: MovesTreeNode;
    let root: MovesTreeNode;

    const { paths } = useRepertoire();
    if (passedLast && passedRoot) {
        root = passedRoot;
        last = passedLast;
    } else {
        const [computedRoot, computedLast] = mergePathsIntoTree(paths);
        last = computedLast;
        root = computedRoot;
    }

    const [currentNode, setCurrentNode] = useState(last);
    const [lastNode, setLastNode] = useState(last);
    const [analysisNode, setAnalysisNode] = useState(root);

    useEffect(() => {
        if (passedLast) {
            setCurrentNode(passedLast);
            setLastNode(passedLast);
        }
    }, [passedLast]);

    useEffect(() => {
        if (!passedRoot && !passedLast) {
            const [, computedLast] = mergePathsIntoTree(paths);
            setCurrentNode(computedLast);
            setLastNode(computedLast);
        }
    }, [paths, passedRoot, passedLast]);

    return (
        <PositionContext.Provider
            value={{
                currentNode,
                setCurrentNode,
                lastNode,
                setLastNode,
                analysisNode,
                setAnalysisNode,
            }}
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
