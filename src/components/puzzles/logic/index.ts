import { MovesTreeNode } from "@/components/utils/MovesTree";
import {
    flattenResult,
    mergePathsIntoTree,
} from "@/components/utils/parseDbResponse";
import { getRepertoire } from "@/lib/actions/repertoire";
import { DbGlobalRepertoire } from "@/lib/types/backend-types";
import { Paths, Pieces, Puzzle, PuzzleFeedback } from "@/lib/types/types";
import { getTreeLeaves, shuffle } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

const getMovesUp = () => (Math.floor(Math.random() * 3) + 1) * 2 - 1;

export const createPuzzlesFromTree = (
    paths: Paths,
    color: "white" | "black"
): Puzzle[] => {
    const [root] = mergePathsIntoTree(flattenResult(paths));
    const puzzles = [];

    let leaves = getTreeLeaves(root).map((leaf) =>
        leaf.player === color ? leaf : leaf.parent
    );

    while (leaves.length > 0) {
        const newLeaves = [];

        for (const leaf of leaves) {
            if (!leaf || leaf.isClaimed()) continue;

            const movesUp = getMovesUp();
            const startingNode = goUpMoves(leaf, movesUp);

            if (startingNode) {
                const puzzle = createPuzzleFromLeaf(leaf, startingNode);
                puzzles.push({ ...puzzle, color, root });

                let current = leaf;
                while (current !== startingNode.parent) {
                    current.claim();
                    current = current.parent;
                }

                if (puzzle.newLeaf) {
                    newLeaves.push(puzzle.newLeaf);
                }
            }
        }

        leaves = newLeaves;
    }
    return puzzles;
};

const createPuzzleFromLeaf = (
    targetNode: MovesTreeNode,
    startingNode: MovesTreeNode
) => {
    const solution = [];
    let currentNode = targetNode;

    while (currentNode !== startingNode) {
        const childIndex = currentNode.parent.children.indexOf(currentNode);
        solution.push(childIndex);
        currentNode = currentNode.parent;
    }

    let newLeaf = null;
    if (targetNode.children.length === 1) {
        newLeaf = targetNode;
    } else if (targetNode.children.length > 1) {
        const allSiblingSubtreesClaimed = targetNode.parent.children
            .filter((child) => child !== targetNode)
            .every((sibling) => isSubtreeClaimed(sibling));

        if (allSiblingSubtreesClaimed) {
            newLeaf = targetNode.parent;
        }
    }

    return {
        startingNode,
        targetNode,
        solution: solution.reverse(),
        newLeaf,
    };
};

const isSubtreeClaimed = (node: MovesTreeNode): boolean => {
    if (node.isClaimed()) return true;

    if (node.children.length === 0) return false;

    return node.children.every((child) => isSubtreeClaimed(child));
};

const goUpMoves = (node: MovesTreeNode, moves: number) => {
    let current = node;

    for (let i = 0; i < moves; i++) {
        current = current.parent;
    }

    if (current.piece === Pieces.EMPTY) return null;

    return current;
};

export const createRepertoire = (color: "white" | "black") => ({
    color: color,
    paths: [],
    timeControls: null,
    ratings: null,
    depth: null,
});

export const usePuzzleQueue = () => {
    const [puzzleQueue, setPuzzleQueue] = useState<(Puzzle | void)[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<PuzzleFeedback>("go");

    const currentPuzzle = puzzleQueue[currentIndex] || null;

    const nextPuzzle = useCallback(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < puzzleQueue.length) {
            setCurrentIndex(nextIndex);
            setFeedback("go");
        } else {
            setFeedback("done");
        }
    }, [currentIndex, puzzleQueue.length]);

    const loadPuzzles = useCallback((puzzles: Puzzle[]) => {
        const shuffledPuzzles = shuffle(puzzles);
        setPuzzleQueue(shuffledPuzzles);
        setCurrentIndex(0);
        setFeedback("go");
    }, []);

    const resetFeedback = useCallback(() => {
        setFeedback("go");
    }, []);

    return {
        currentPuzzle,
        feedback,
        setFeedback,
        nextPuzzle,
        loadPuzzles,
        resetFeedback,
        hasMorePuzzles: currentIndex < puzzleQueue.length - 1,
    };
};

export const useGlobalPuzzles = (paths: DbGlobalRepertoire) => {
    const [globalPuzzles, setGlobalPuzzles] = useState<Puzzle[]>([]);

    useEffect(() => {
        const { white, black } = paths;
        const whitePuzzles = createPuzzlesFromTree(white, "white");
        const blackPuzzles = createPuzzlesFromTree(black, "black");
        const allPuzzles = [...whitePuzzles, ...blackPuzzles];

        setGlobalPuzzles(allPuzzles);
    }, [paths]);

    return globalPuzzles;
};

export const useRepertoirePuzzles = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRepertoirePuzzles = useCallback(
        async (repertoireId: string): Promise<Puzzle[]> => {
            setLoading(true);
            setError(null);

            try {
                const data = await getRepertoire(repertoireId);
                if (data.success && data.value) {
                    return createPuzzlesFromTree(
                        data.value.paths,
                        data.value.color
                    );
                }
                throw new Error("Failed to fetch repertoire data");
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred";
                setError(errorMessage);
                console.error("Error fetching repertoire:", err);
                return [];
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { fetchRepertoirePuzzles, loading, error };
};

export const useAutoSkip = (
    feedback: PuzzleFeedback,
    nextPuzzle: () => void
) => {
    const [autoSkip, setAutoSkip] = useState(false);

    useEffect(() => {
        if (feedback === "correct" && autoSkip) {
            nextPuzzle();
        }
    }, [feedback, autoSkip, nextPuzzle]);

    return { autoSkip, setAutoSkip };
};
