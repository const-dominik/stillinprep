import { z } from "zod";

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

export const RootSegmentSchema = z.object({
    end: MoveSchema,
    start: RootSchema,
    relationship: z.object({}).passthrough(),
});

export const MoveSegmentSchema = z.object({
    end: MoveSchema,
    start: MoveSchema,
    relationship: z.object({}).passthrough(),
});

export const PathSchema = z.object({
    end: MoveSchema,
    start: RootSchema,
    segments: z.tuple([RootSegmentSchema]).rest(MoveSegmentSchema),
});
