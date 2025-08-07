import { MovesTreeNode } from "@/components/utils/MovesTree";

type ExplorerMove = {
    san: string;
    white: number;
    black: number;
    draws: number;
    avgRating: number;
};

type ExplorerResponse = {
    moves: ExplorerMove[];
    nbGames: number;
    white: number;
    draws: number;
    black: number;
};

const fetchOpeningExplorerStats = async (
    fen: string
): Promise<ExplorerResponse> => {
    const url = `https://explorer.lichess.ovh/lichess?variant=standard&fen=${encodeURIComponent(fen)}`;
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

export const getRepertoireFeedback = async (
    subTree: MovesTreeNode
): Promise<[string, number][]> => {
    const allGamesData = await fetchOpeningExplorerStats(subTree.getFEN());
    const allGames = sumGames(allGamesData);

    const getData = async (
        node: MovesTreeNode,
        moves: string
    ): Promise<[string, number][]> => {
        const data = await fetchOpeningExplorerStats(node.getFEN());
        const loadedMoves: [string, number][] = extractMoveCounts(data);
        const checkmoves: [string, number][] = [];
        const deeperMoves: [string, number][] = [];

        for (const child of node.children) {
            const childMove = child.getAlgebraicNotation();
            if (loadedMoves.some(([move]) => move === childMove)) {
                const move = loadedMoves.filter(
                    ([move]) => move === childMove
                )[0];

                checkmoves.push(move);

                for (const grandchild of child.children) {
                    deeperMoves.push(
                        ...(await getData(
                            grandchild,
                            moves +
                                " " +
                                move[0] +
                                " " +
                                grandchild.getAlgebraicNotation()
                        ))
                    );
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
        ([move, count]) => [move, (count / allGames) * 100]
    );

    normalizedMoves.sort((a, b) => b[1] - a[1]);

    return normalizedMoves;
};
