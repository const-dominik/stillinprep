import { MovesTreeNode } from "@/components/utils/MovesTree";
import {
    flattenResult,
    mergePathsIntoTree,
} from "@/components/utils/parseDbResponse";
import { saveSpacedRepetitionData } from "@/lib/actions/puzzles";
import { getRepertoire } from "@/lib/actions/repertoire";
import { DbGlobalRepertoire } from "@/lib/types/backend-types";
import {
    MyOption,
    Paths,
    Pieces,
    Puzzle,
    PuzzleFeedback,
    PuzzleMode,
    SpacedPuzzleData,
} from "@/lib/types/types";
import { getOppositePlayer, getTreeLeaves, shuffle } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const getMovesUp = () => (Math.floor(Math.random() * 3) + 1) * 2 - 1;

export const createPuzzlesFromTree = (
    paths: Paths,
    color: "white" | "black"
): Puzzle[] => {
    if (!paths.length) return [];
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

                if (startingNode.parent) {
                    newLeaves.push(startingNode.parent);
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
        if (current.parent === current.parent.parent && current !== node)
            return current;
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

const walkPuzzleNodes = (
    puzzle: Puzzle,
    callback: (node: MovesTreeNode) => void
) => {
    let node = puzzle.targetNode;
    while (node && node !== puzzle.startingNode.parent) {
        callback(node);
        node = node.parent;
    }
};

const getPuzzleMoveIdsByColor = (puzzle: Puzzle) => {
    const ids: string[] = [];
    walkPuzzleNodes(puzzle, (node) => {
        if (getOppositePlayer(node.player) === puzzle.color) {
            ids.push(node.getMoveHash());
        }
    });
    return ids;
};

class SpacedRepetitionManager {
    private spacedPuzzles: Puzzle[] = [];
    private currentPosition = 0;
    private wrongNodes: Record<string, number> = {};

    constructor(
        private spacedData: SpacedPuzzleData,
        private globalPuzzles: Puzzle[]
    ) {
        this.initialize();
    }

    private initialize() {
        const now = Date.now();
        const idsToRepeat = new Set(
            Object.entries(this.spacedData.puzzles)
                .filter(
                    ([, puzzleData]) =>
                        now >= new Date(puzzleData.next_attempt).getTime()
                )
                .map(([id]) => id)
        );
        const knownIds = new Set(Object.keys(this.spacedData.puzzles));

        this.spacedPuzzles = shuffle(
            this.globalPuzzles.filter((puzzle) => {
                let shouldUse = false;
                walkPuzzleNodes(puzzle, (node) => {
                    if (getOppositePlayer(node.player) !== puzzle.color) return;
                    const id = node.getMoveHash();
                    if (idsToRepeat.has(id) || !knownIds.has(id)) {
                        shouldUse = true;
                    }
                });
                return shouldUse;
            })
        );
    }

    getCurrentPuzzle(): Puzzle | null {
        return this.spacedPuzzles[this.currentPosition] || null;
    }

    getRemainingCount(): number {
        return Math.max(0, this.spacedPuzzles.length - this.currentPosition);
    }

    isComplete(): boolean {
        return this.currentPosition >= this.spacedPuzzles.length;
    }

    markWrongNode(nodeId: string) {
        this.wrongNodes[nodeId] = (this.wrongNodes[nodeId] || 0) + 1;
    }

    completeCurrentPuzzle(): boolean {
        const currentPuzzle = this.getCurrentPuzzle();
        if (!currentPuzzle) return false;

        getPuzzleMoveIdsByColor(currentPuzzle).forEach((id) => {
            this.wrongNodes[id] ??= 0;
        });
        saveSpacedRepetitionData(this.wrongNodes);

        this.currentPosition++;
        return true;
    }

    reset() {
        this.currentPosition = 0;
        this.wrongNodes = {};
    }
}

export const usePuzzleManager = (
    paths: DbGlobalRepertoire,
    spacedData: SpacedPuzzleData
) => {
    const [mode, setMode] = useState<PuzzleMode>("global");
    const [repertoire, setRepertoire] = useState<MyOption | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<PuzzleFeedback>("go");
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [loading, setLoading] = useState(false);
    const [autoSkip, setAutoSkip] = useState(false);
    const [spacedPosition, setSpacedPosition] = useState(0);

    const globalPuzzles = useMemo(() => {
        const { white, black } = paths;
        const whitePuzzles = createPuzzlesFromTree(white, "white");
        const blackPuzzles = createPuzzlesFromTree(black, "black");
        return [...whitePuzzles, ...blackPuzzles];
    }, [paths]);

    const spacedManagerRef = useRef<SpacedRepetitionManager | null>(null);

    useEffect(() => {
        if (globalPuzzles.length && !spacedManagerRef.current) {
            spacedManagerRef.current = new SpacedRepetitionManager(
                spacedData,
                globalPuzzles
            );
        }
    }, [globalPuzzles, spacedData]);

    const currentPuzzle = useMemo(() => {
        if (mode === "spaced" && spacedManagerRef.current) {
            return spacedManagerRef.current.getCurrentPuzzle();
        }
        return puzzles[currentIndex] || null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, puzzles, currentIndex, spacedPosition]);

    const handleFeedback = useCallback(
        (status: PuzzleFeedback, nodeId?: string) => {
            setFeedback(status);

            if (
                status === "wrong" &&
                nodeId &&
                mode === "spaced" &&
                spacedManagerRef.current
            ) {
                spacedManagerRef.current.markWrongNode(nodeId);
            }
        },
        [mode]
    );

    const nextPuzzle = useCallback(() => {
        if (mode === "spaced" && spacedManagerRef.current) {
            if (feedback === "correct") {
                spacedManagerRef.current.completeCurrentPuzzle();
            }

            if (spacedManagerRef.current.isComplete()) {
                setFeedback("done");
            } else {
                setFeedback("go");
                setSpacedPosition((prev) => prev + 1);
            }
        } else {
            const nextIndex = currentIndex + 1;
            if (nextIndex < puzzles.length) {
                setCurrentIndex(nextIndex);
                setFeedback("go");
            } else {
                setFeedback("done");
            }
        }
    }, [mode, feedback, currentIndex, puzzles.length]);

    useEffect(() => {
        if (feedback === "correct" && autoSkip) {
            const timer = setTimeout(nextPuzzle, 100);
            return () => clearTimeout(timer);
        }
    }, [feedback, autoSkip, nextPuzzle]);

    useEffect(() => {
        const loadPuzzlesForMode = async () => {
            setLoading(true);
            setFeedback("go");
            setCurrentIndex(0);

            try {
                switch (mode) {
                    case "global":
                        setPuzzles(shuffle(globalPuzzles));
                        setFeedback(globalPuzzles.length ? "go" : "done");
                        break;

                    case "repertoire":
                        if (repertoire) {
                            const data = await getRepertoire(repertoire.value);
                            if (data.success && data.value) {
                                const repPuzzles = createPuzzlesFromTree(
                                    data.value.paths,
                                    data.value.color
                                );
                                setPuzzles(shuffle(repPuzzles));
                                setFeedback(repPuzzles.length ? "go" : "done");
                            } else {
                                setPuzzles([]);
                                setFeedback("done");
                            }
                        } else {
                            setPuzzles([]);
                            setFeedback("done");
                        }
                        break;

                    case "spaced":
                        setPuzzles([]);
                        setSpacedPosition(0);
                        if (spacedManagerRef.current) {
                            setFeedback(
                                spacedManagerRef.current.getRemainingCount() > 0
                                    ? "go"
                                    : "done"
                            );
                        }
                        break;
                }
            } catch (error) {
                console.error("Error loading puzzles:", error);
                setPuzzles([]);
                setFeedback("done");
            } finally {
                setLoading(false);
            }
        };

        loadPuzzlesForMode();
    }, [mode, repertoire, globalPuzzles]);

    const puzzlesNotLoaded = useMemo(() => {
        if (loading) return true;
        if (feedback === "done") return false;

        if (mode === "spaced") {
            return (
                !spacedManagerRef.current ||
                spacedManagerRef.current.getRemainingCount() === 0
            );
        }

        return !currentPuzzle;
    }, [loading, feedback, mode, currentPuzzle]);

    return {
        mode,
        setMode,
        repertoire,
        setRepertoire,
        currentPuzzle,
        feedback,
        handleFeedback,
        nextPuzzle,
        autoSkip,
        setAutoSkip,
        loading,
        puzzlesNotLoaded,
        spacedPuzzlesRemaining:
            spacedManagerRef.current?.getRemainingCount() || 0,
    };
};
