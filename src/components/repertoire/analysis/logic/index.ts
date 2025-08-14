import { getLastFour } from "@/components/utils/chessAlgebraicNotation";
import { MovesTreeNode } from "@/components/utils/MovesTree";
import {
    ExplorerOptions,
    ExplorerResponse,
    FeedbackLine,
    Player,
} from "@/lib/types/types";
import { buildExplorerUrl } from "../../repertoire-utils";

export const fetchOpeningExplorerStats = async (
    url: string
): Promise<ExplorerResponse> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Błąd API: ${res.status}`);
    return await res.json();
};

const sumGames = (data: ExplorerResponse): number => {
    return data.white + data.draws + data.black;
};

const extractMoveCounts = (
    data: ExplorerResponse,
    node: MovesTreeNode
): [string, number, MovesTreeNode][] => {
    const moves: [string, number, MovesTreeNode][] = [];
    for (const move of data.moves) {
        moves.push([move.san, move.white + move.black + move.draws, node]);
    }

    return moves;
};

const getRepertoireFeedback = async (
    subTree: MovesTreeNode,
    explorerOptions: ExplorerOptions
): Promise<[string, number, MovesTreeNode][]> => {
    const allGamesData = await fetchOpeningExplorerStats(
        buildExplorerUrl(explorerOptions)
    );
    const allGames = sumGames(allGamesData);

    const getData = async (
        node: MovesTreeNode,
        moves: string
    ): Promise<[string, number, MovesTreeNode][]> => {
        explorerOptions.fen = node.getFEN();
        const data = await fetchOpeningExplorerStats(
            buildExplorerUrl(explorerOptions)
        );
        const loadedMoves: [string, number, MovesTreeNode][] =
            extractMoveCounts(data, node);
        const checkmoves: [string, number, MovesTreeNode][] = [];
        const deeperMoves: [string, number, MovesTreeNode][] = [];
        if (sumGames(data) < 5) return [];

        for (const child of node.children) {
            const childMove = child.getAlgebraicNotation();
            if (loadedMoves.some(([move]) => move === childMove)) {
                const move = loadedMoves.filter(
                    ([move]) => move === childMove
                )[0];

                if (child.children.length > 0) checkmoves.push(move);

                for (const grandchild of child.children) {
                    const newMoves = await getData(
                        grandchild,
                        `${moves} ${move[0]} ${grandchild.getAlgebraicNotation()}`
                    );
                    deeperMoves.push(...newMoves);
                }
            }
        }

        const filteredData = loadedMoves.filter(
            (move) => !checkmoves.includes(move)
        );

        const mapedMoves = filteredData.map<[string, number, MovesTreeNode]>(
            ([move, x, nodePrev]) => [moves + " " + move, x, nodePrev]
        );
        mapedMoves.push(...deeperMoves);

        return mapedMoves;
    };

    const rawMoves = await getData(subTree, subTree.getAlgebraicNotation());

    const normalizedMoves: [string, number, MovesTreeNode][] = rawMoves.map(
        ([move, count, _node]) => [move, count / allGames, _node]
    );

    const sortedMoves = normalizedMoves.toSorted((a, b) => b[1] - a[1]);

    const readyMoves = sortedMoves.map<[string, number, MovesTreeNode]>(
        ([moves, val, _node]) => {
            const m = String(moves);
            return m.startsWith("root ")
                ? [m.slice(5), val, _node]
                : [m, val, _node];
        }
    );
    return readyMoves;
};

export const getFeedback = async (
    color: "white" | "black",
    subTree: MovesTreeNode,
    explorerOptions: ExplorerOptions
): Promise<[string, number, MovesTreeNode][]> => {
    if (subTree.getCurrentPlayer() !== color) {
        return await getRepertoireFeedback(subTree, explorerOptions);
    }

    const lines: [string, number, MovesTreeNode][][] = await Promise.all(
        subTree.children.map((node) =>
            getRepertoireFeedback(node, explorerOptions)
        )
    );

    return lines.flat();
};

export const getFraction = (odds: number): string => {
    const limit = 2500;
    let i = 1;
    while (1 / i > odds) {
        if (i >= limit) return "less 1/2500";

        i += 1;
    }

    if (i > 1000) i = i - (i % 50);
    if (i > 100) i = i - (i % 10);
    return "1 in " + String(i);
};

export const getLastMove = (moves: string): string => {
    const movesArr = moves.trim().split(/\s+/);
    return movesArr[movesArr.length - 1] || "";
};

export const getFeedbackLines = async (
    color: Player,
    currentNode: MovesTreeNode,
    explorerOptions: ExplorerOptions
): Promise<FeedbackLine[]> => {
    const feedback = await getFeedback(color, currentNode, explorerOptions);
    const newLines = feedback.map<FeedbackLine>(([moves, odds, node]) => {
        return {
            odds: getFraction(odds),
            line: getLastFour(moves, node),
            fromNode: node,
        };
    });
    return newLines;
};
