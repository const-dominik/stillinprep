import { z } from "zod/v4";

export const RepertoireSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
});

export const BaseNodeSchema = z.object({
    elementId: z.string(),
    identity: z.object({
        low: z.number(),
        high: z.number(),
    }),
    labels: z.tuple([z.string()]),
});

export const MoveSchema = BaseNodeSchema.extend({
    properties: z.object({
        from: z.tuple([z.number(), z.number()]),
        id: z.string(),
        name: z.string(),
        promotion: z.string(),
        to: z.tuple([z.number(), z.number()]),
    }),
});

export const RootSchema = BaseNodeSchema.extend({
    properties: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

export const RootSegmentSchema = z.looseObject({
    end: MoveSchema,
    start: RootSchema,
    relationship: z.object({}),
});

export const MoveSegmentSchema = z.looseObject({
    end: MoveSchema,
    start: MoveSchema,
    relationship: z.object({}),
});

export const PathSchema = z.object({
    end: MoveSchema,
    start: RootSchema,
    segments: z.tuple([RootSegmentSchema]).rest(MoveSegmentSchema),
});

export const OpeningExplorer = z.object({
    eco: z.string(),
    name: z.string(),
});

export const PopularMove = z.looseObject({
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
