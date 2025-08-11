import { ExplorerOptions } from "@/lib/types/types";

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
