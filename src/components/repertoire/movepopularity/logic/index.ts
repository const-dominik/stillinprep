import { MovesTreeNode } from "@/components/utils/MovesTree";
import { LichessMovePopularityResponse } from "@/lib/schema";
import {
    DbType,
    ExplorerOptions,
    LichessPopularMove,
    LiDbRating,
    MovePopualritySettings,
} from "@/lib/types/types";
import { avgRatingsToRatings } from "@/lib/utils";
import { buildExplorerUrl } from "../../repertoire-utils";

export const getPopularMoves = async (
    dbType: DbType,
    settings: MovePopualritySettings,
    node: MovesTreeNode
) => {
    const parameters: ExplorerOptions = {
        fen: node.getFEN(),
        database: dbType,
        variant: "standard",
        speeds: settings.timeControls,
        moves: 6,
        ratings: settings.ratings.reduce<LiDbRating[]>(
            (prev, curr) => [...prev, ...avgRatingsToRatings[curr]],
            []
        ),
    };
    const URL = buildExplorerUrl(parameters);

    const response = await fetch(URL);
    const data = await response.json();

    try {
        const parsedResponse = LichessMovePopularityResponse.parse(data);

        return parsedResponse;
    } catch (e) {
        console.log(e);
    }

    return null;
};

export const calculateMoveStats = (
    move: LichessPopularMove,
    totalGames: number
) => {
    const totalGamesForMove = move.black + move.draws + move.white;
    const percentage = (totalGamesForMove / totalGames) * 100;
    return { totalGamesForMove, percentage };
};
