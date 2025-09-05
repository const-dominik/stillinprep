"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { mergePathsIntoTree } from "@/components/utils/parseDbResponse";
import { PositionContextValue, Puzzle } from "@/lib/types/types";
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
    puzzle,
}: {
    children: ReactNode;
    puzzle?: Puzzle;
}) => {
    let last: MovesTreeNode;
    let root: MovesTreeNode;

    const { paths } = useRepertoire();
    if (puzzle) {
        const { root: passedRoot, startingNode: passedLast } = puzzle;
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
        if (puzzle) {
            const { startingNode: passedLast } = puzzle;
            setCurrentNode(passedLast);
            setLastNode(passedLast);
        }
    }, [puzzle]);

    useEffect(() => {
        if (!puzzle) {
            const [, computedLast] = mergePathsIntoTree(paths);
            setCurrentNode(computedLast);
            setLastNode(computedLast);
        }
    }, [paths, puzzle]);

    return (
        <PositionContext.Provider
            value={{
                currentNode,
                setCurrentNode,
                lastNode,
                setLastNode,
                analysisNode,
                setAnalysisNode,
                root,
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
