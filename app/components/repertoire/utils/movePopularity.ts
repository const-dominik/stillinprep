import {
    DbType,
    LiAPIQueryParameters,
    LiDbRating,
    MovePopualritySettings,
} from "@/app/types/types";
import { avgRatingsToRatings } from "@/app/utils";
import { LichessMovePopularityResponse } from "./schemas";

const getQueryParameters = (
    dbType: DbType,
    settings: MovePopualritySettings,
    moves: string
): LiAPIQueryParameters => {
    const common = {
        play: moves,
        moves: 6,
    };
    const db = dbType === "players" ? "lichess" : "masters";

    if (db === "lichess") {
        return {
            ...common,
            db,
            variant: "standard",
            speeds: settings.timeControls,
            ratings: settings.ratings.reduce<LiDbRating[]>(
                (prev, curr) => [...prev, ...avgRatingsToRatings[curr]],
                []
            ),
        };
    }

    return {
        ...common,
        db,
    };
};

const buildURL = (parameters: LiAPIQueryParameters): string => {
    const base = `https://explorer.lichess.ovh/${parameters.db}`;
    const query = new URLSearchParams({
        play: parameters.play,
        moves: parameters.moves.toString(),
    });

    if (parameters.db === "lichess") {
        query.set("variant", parameters.variant);
        query.set("speeds", parameters.speeds.join(","));
        query.set("ratings", parameters.ratings.join(","));
    }

    return `${base}?${query.toString()}`;
};

export const getPopularMoves = async (
    dbType: DbType,
    settings: MovePopualritySettings,
    moves: string
) => {
    const parameters = getQueryParameters(dbType, settings, moves);
    const URL = buildURL(parameters);

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
