import { validatePassword } from "@/components/auth-forms/utils";
import { z } from "zod/v4";
import { nicknameRegex } from "../utils";

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

export const nicknameSchema = z.string().min(3).max(20).regex(nicknameRegex);

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .refine(validatePassword, "Password does not meet requirements.");

export const identifierSchema = nicknameSchema.or(z.email());

export const RegisterSchema = z
    .object({
        nickname: nicknameSchema,
        email: z.email(),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords don't match.",
    });

export const RegisterUserResponse = z.object({
    id: z.uuidv4(),
    email: z.email(),
    nickname: z.string(),
});

export const VerificationTokenResponse = z.object({
    expires: z.number(),
});

// completeProfile
export const CompleteProfileArgs = z.object({
    id: z.uuidv4(),
    nickname: nicknameSchema,
});

// login
export const LoginArgs = z.object({
    identifier: identifierSchema,
    password: passwordSchema,
});

export const DbUserSchema = z.object({
    email: z.email(),
    id: z.string(),
    nickname: z.optional(nicknameSchema).nullable(),
    emailVerified: z.optional(z.looseObject({})).nullable(),
    password: z.optional(z.string()),
});

// passwordRecovery
export const NewTokenSchema = z.object({
    email: z.email(),
    token: z.string(),
});

export const ChangePasswordSArgs = z.object({
    token: z.string(),
    newPassword: passwordSchema,
});

// edit repertoire
export const RepertoireEditDataSchema = z.object({
    name: z.string().min(1),
    visibility: z.enum(["public", "private"]),
    hasAccess: z.array(
        z.object({
            nickname: z.string().min(3),
            mode: z.enum(["edit", "readonly"]),
        })
    ),
});

export const RepertoireSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    visibility: z.enum(["public", "private"]),
    hasAccess: z.array(
        z.object({
            nickname: z.string().min(3),
            mode: z.enum(["edit", "readonly"]),
        })
    ),
});

export const RepertoireCreatedSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
});

export const OwnedRepertoireData = z.object({
    id: z.string(),
    name: z.string().min(1),
    visibility: z.enum(["public", "private"]),
    hasAccess: z.array(
        z.object({
            nickname: z.string().min(3),
            mode: z.enum(["edit", "readonly"]),
        })
    ),
    source: z.literal("owned"),
});

export const PublicRepertoireData = z.object({
    id: z.string(),
    name: z.string().min(1),
    visibility: z.literal("public"),
    source: z.literal("public"),
    owner: z.object({
        id: z.string(),
        nickname: z.string().min(3),
    }),
});

export const SharedRepertoireData = z.object({
    id: z.string(),
    name: z.string().min(1),
    visibility: z.enum(["public", "private"]),
    source: "shared",
    accessMode: z.enum(["edit", "readonly"]),
    owner: z.object({
        id: z.string(),
        nickname: z.string().min(3),
    }),
});
