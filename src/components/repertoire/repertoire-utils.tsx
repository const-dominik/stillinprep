import { ExplorerOptions } from "@/lib/types/types";
import { MovesTreeNode } from "../utils/MovesTree";
import { parseMove } from "../utils/chessAlgebraicNotation";
import { addMoveToDb } from "./chessboard/logic";

export const buildExplorerUrl = (options: ExplorerOptions): string => {
    const params = new URLSearchParams();

    params.set("variant", options.variant ?? "standard");
    params.set("fen", options.fen);

    if (options.moves !== undefined) {
        params.set("moves", options.moves.toString());
    }

    if (options.database === "masters")
        return `https://explorer.lichess.ovh/masters?${params.toString()}`;

    if (options.speeds?.length) {
        params.set("speeds", options.speeds.join(","));
    }

    if (options.ratings?.length) {
        params.set("ratings", options.ratings.join(","));
    }

    if (options.topGames !== undefined) {
        params.set("topGames", options.topGames.toString());
    }

    if (options.recentGames !== undefined) {
        params.set("recentGames", options.recentGames.toString());
    }

    return `https://explorer.lichess.ovh/lichess?${params.toString()}`;
};

export const setLineOnClick = (
    setCurrentNode: (n: MovesTreeNode) => void,
    setLastNode: (n: MovesTreeNode) => void,
    previousNode: MovesTreeNode,
    move: string,
    repertoireId: string
) => {
    const [from, to, piece, newBoard] = parseMove(move, previousNode);
    const { node, isNew } = previousNode.addMove(piece, from, to, newBoard);
    setCurrentNode(node);
    setLastNode(node);

    if (isNew) {
        addMoveToDb(node, repertoireId);
    }
};
