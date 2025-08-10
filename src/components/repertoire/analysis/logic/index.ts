import { MovesTreeNode } from "@/components/utils/MovesTree";
import { ExplorerOptions, ExplorerResponse } from "@/lib/types/types";

export const buildExplorerUrl = (options: ExplorerOptions): string => {
    const params = new URLSearchParams();

    params.set("variant", options.variant ?? "standard");
    params.set("fen", options.fen);

    if (options.speeds?.length) {
        params.set("speeds", options.speeds.join(","));
    }

    if (options.ratings?.length) {
        params.set("ratings", options.ratings.join(","));
    }

    if (options.moves !== undefined) {
        params.set("moves", options.moves.toString());
    }

    if (options.topGames !== undefined) {
        params.set("topGames", options.topGames.toString());
    }

    if (options.recentGames !== undefined) {
        params.set("recentGames", options.recentGames.toString());
    }

    if (options.database !== undefined) {
        params.set("database", options.database.toString());
    }

    return `https://explorer.lichess.ovh/lichess?${params.toString()}`;
};

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

const extractMoveCounts = (data: ExplorerResponse): [string, number][] => {
    const moves: [string, number][] = [];
    for (const move of data.moves) {
        moves.push([move.san, move.white + move.black + move.draws]);
    }

    return moves;
};

const getRepertoireFeedback = async (
    subTree: MovesTreeNode,
    explorerOptions: ExplorerOptions
): Promise<[string, number][]> => {
    const allGamesData = await fetchOpeningExplorerStats(
        buildExplorerUrl(explorerOptions)
    );
    const allGames = sumGames(allGamesData);

    const getData = async (
        node: MovesTreeNode,
        moves: string
    ): Promise<[string, number][]> => {
        explorerOptions.fen = node.getFEN();
        const data = await fetchOpeningExplorerStats(
            buildExplorerUrl(explorerOptions)
        );
        const loadedMoves: [string, number][] = extractMoveCounts(data);
        const checkmoves: [string, number][] = [];
        const deeperMoves: [string, number][] = [];
        if (sumGames(data) < 5) return [];

        for (const child of node.children) {
            const childMove = child.getAlgebraicNotation();
            if (loadedMoves.some(([move]) => move === childMove)) {
                const move = loadedMoves.filter(
                    ([move]) => move === childMove
                )[0];

                checkmoves.push(move);

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

        const mapedMoves = filteredData.map<[string, number]>(([move, x]) => [
            moves + " " + move,
            x,
        ]);
        mapedMoves.push(...deeperMoves);

        return mapedMoves;
    };

    const rawMoves = await getData(subTree, subTree.getAlgebraicNotation());

    const normalizedMoves: [string, number][] = rawMoves.map(
        ([move, count]) => [move, count / allGames]
    );

    const sortedMoves = normalizedMoves.toSorted((a, b) => b[1] - a[1]);

    const readyMoves = sortedMoves.map<[string, number]>(([moves, val]) => {
        const m = String(moves);
        return m.startsWith("root ") ? [m.slice(5), val] : [m, val];
    });

    return readyMoves;
};

export const getFeedback = async (
    color: "white" | "black",
    subTree: MovesTreeNode,
    explorerOptions: ExplorerOptions
): Promise<[string, number][]> => {
    if (subTree.getCurrentPlayer() !== color) {
        return await getRepertoireFeedback(subTree, explorerOptions);
    }

    const lines: [string, number][][] = await Promise.all(
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

    if (i > 1000) i = i - (i % 100);
    if (i > 100) i = i - (i % 10);
    return "1/" + String(i);
};
