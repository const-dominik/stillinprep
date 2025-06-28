import { z } from "zod/v4";

const OpeningExplorer = z.object({
    eco: z.string(),
    name: z.string(),
});

const PopularMove = z.looseObject({
    uci: z.string(),
    san: z.string(),
    averageRating: z.number().positive(),
    white: z.number().nonnegative(),
    black: z.number().nonnegative(),
    draws: z.number().nonnegative(),
});

export const LichessMovePopularityResponse = z.looseObject({
    opening: z.nullable(OpeningExplorer),
    white: z.number().nonnegative(),
    black: z.number().nonnegative(),
    draws: z.number().nonnegative(),
    moves: z.array(PopularMove),
});
