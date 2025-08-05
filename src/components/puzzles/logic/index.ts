import { MovesTreeNode } from "@/components/utils/MovesTree";
import {
    flattenResult,
    mergePathsIntoTree,
} from "@/components/utils/parseDbResponse";
import { Paths, Pieces, Puzzle } from "@/lib/types/types";
import { getTreeLeaves } from "@/lib/utils";

const getMovesUp = () => (Math.floor(Math.random() * 3) + 1) * 2 + 1;

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
