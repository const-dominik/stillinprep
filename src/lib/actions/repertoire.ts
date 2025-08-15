"use server";

import { getNeoSession } from "@/lib/neo4j";
import { Path } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import { z } from "zod/v4";
import { auth } from "../auth";
import {
    OwnedRepertoireData,
    PathSchema,
    PublicRepertoireData,
    RepertoireCreatedSchema,
    RepertoireEditDataSchema,
    SharedRepertoireData,
} from "../schema";
import {
    DbGlobalRepertoire,
    DbRepertoire,
    DbRepertoires,
    ServerActionResponse,
} from "../types/backend-types";
import { RepertoireEditData } from "../types/types";

export const getRepertoires = async (): ServerActionResponse<DbRepertoires> => {
    const authSession = await auth();

    if (!authSession?.user) {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    const userId = authSession.user.id;
    const session = getNeoSession();

    try {
        const result = await session.run(
            `
        CALL {
            MATCH (u:User { id: $userId })-[:OWNS]->(r:Repertoire)
            OPTIONAL MATCH (accessUser:User)-[rel:HAS_EDIT_ACCESS|HAS_READONLY_ACCESS]->(r)
            WITH r, COLLECT(
                CASE 
                WHEN accessUser IS NOT NULL AND rel IS NOT NULL THEN {
                    nickname: accessUser.nickname,
                    mode: CASE
                        WHEN TYPE(rel) = "HAS_EDIT_ACCESS" THEN "edit"
                        ELSE "readonly"
                    END
                }
                END
            ) AS rawAccesses
            WITH r, [x IN rawAccesses WHERE x IS NOT NULL] AS hasAccess
            RETURN collect(r {
                .id,
                .name,
                .visibility,
                .color,
                hasAccess: hasAccess,
                source: "owned"
            }) AS owned
        }

        CALL {
            MATCH (r:Repertoire)
            WHERE r.visibility = "public"
            OPTIONAL MATCH (owner:User)-[:OWNS]->(r)
            RETURN collect(r {
                .id,
                .name,
                .visibility,
                .color,
                source: "public",
                owner: owner { .id, .nickname }
            }) AS public
        }

        CALL {
            MATCH (u:User { id: $userId })-[rel:HAS_EDIT_ACCESS|HAS_READONLY_ACCESS]->(r:Repertoire)
            WHERE NOT (u)-[:OWNS]->(r)
            OPTIONAL MATCH (owner:User)-[:OWNS]->(r)
            RETURN collect(r {
                .id,
                .name,
                .visibility,
                .color,
                source: "shared",
                accessMode: CASE
                    WHEN TYPE(rel) = "HAS_EDIT_ACCESS" THEN "edit"
                    ELSE "readonly"
                END,
                owner: owner { .id, .nickname }
            }) AS shared
        }

        RETURN owned, public, shared
        `,
            { userId }
        );

        const record = result.records[0];
        const owned = record.get("owned") || [];
        const publicReps = record.get("public") || [];
        const shared = record.get("shared") || [];

        if (
            !Array.isArray(owned) ||
            !Array.isArray(publicReps) ||
            !Array.isArray(shared)
        ) {
            throw new Error("Not an array!");
        }

        const ownedRepertoires = owned.map((rep) =>
            OwnedRepertoireData.parse(rep)
        );

        const publicRepertoires = publicReps.map((rep) =>
            PublicRepertoireData.parse(rep)
        );

        console.log(shared);
        const sharedRepertoires = shared.map((rep) =>
            SharedRepertoireData.parse(rep)
        );

        const data = {
            owned: ownedRepertoires,
            public: publicRepertoires,
            shared: sharedRepertoires,
        };

        return { success: true, value: data };
    } catch (err) {
        console.error("Neo4j error:", err);
        throw new Error("Failed to fetch repertoires");
    } finally {
        await session.close();
    }
};

export const getGlobalRepertoire =
    async (): ServerActionResponse<DbGlobalRepertoire> => {
        const authSession = await auth();

        if (!authSession?.user) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        const userId = authSession.user.id;
        const session = getNeoSession();

        try {
            const query = `
            MATCH (u:User {id: $userId})
            OPTIONAL MATCH (u)-[rel:OWNS]->(r:Repertoire)
            
            WITH u, r
            WHERE r IS NOT NULL
            
            OPTIONAL MATCH (r)-[:LEAF]->(leaf:Move)
            MATCH (root:Move {name: "root"})
            OPTIONAL MATCH path = (root)-[:IS_PARENT_OF*1..]->(leaf)
            
            WITH r.color as color, collect(DISTINCT path) as paths
            WHERE color IN ['white', 'black'] AND size(paths) > 0
            
            WITH 
                CASE WHEN color = 'white' THEN paths ELSE [] END as whitePaths,
                CASE WHEN color = 'black' THEN paths ELSE [] END as blackPaths
            
            RETURN 
                reduce(acc = [], p IN collect(whitePaths) | acc + p) as white,
                reduce(acc = [], p IN collect(blackPaths) | acc + p) as black
        `;

            const result = await session.run(query, {
                userId,
            });

            const record = result.records[0];

            if (!record) {
                return { success: false, error: "No record." };
            }

            const whitePaths = record.get("white") as Path[];
            const blackPaths = record.get("black") as Path[];

            const parsedWhitePaths = whitePaths.map((path) => {
                const parsedPath = PathSchema.parse(path);
                return parsedPath;
            });

            const parsedBlackPaths = blackPaths.map((path) => {
                const parsedPath = PathSchema.parse(path);
                return parsedPath;
            });

            return {
                success: true,
                value: {
                    white: parsedWhitePaths,
                    black: parsedBlackPaths,
                },
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                error: "Sorry. Something went wrong.",
            };
        } finally {
            await session.close();
        }
    };

export const getRepertoire = async (
    id: string
): ServerActionResponse<DbRepertoire | undefined> => {
    if (process.env.TEST_ENV === "true") {
        return {
            success: true,
            value: {
                timeControls: "rapid",
                ratings: "1700",
                depth: "15",
                paths: [],
                color: "white",
            },
        };
    }

    const authSession = await auth();

    if (!authSession?.user) {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    const userId = authSession.user.id;
    const session = getNeoSession();

    try {
        const query = `
            MATCH (r:Repertoire {id: $repertoireId})
            OPTIONAL MATCH (u:User {id: $userId})
            OPTIONAL MATCH (u)-[rel:OWNS|HAS_READONLY_ACCESS|HAS_EDIT_ACCESS]->(r)

            WITH r, u, rel,
                r.visibility AS visibility,
                u IS NOT NULL AS isAuthenticated,
                rel IS NOT NULL AS hasAccess

            WHERE (visibility = "public" AND isAuthenticated) OR hasAccess

            OPTIONAL MATCH (r)-[:LEAF]->(leaf:Move)
            MATCH (root:Move {name: "root"})
            OPTIONAL MATCH path = (root)-[:IS_PARENT_OF*1..]->(leaf)

            RETURN
                collect(DISTINCT path) AS paths,
                r.timeControls AS timeControls,
                r.ratings AS ratings,
                r.depth AS depth,
                r.color AS color
        `;

        const result = await session.run(query, {
            repertoireId: id,
            userId,
        });

        const record = result.records[0];

        if (!record) {
            return { success: false, error: "No record." };
        }

        const paths = record.get("paths") as Path[];
        const timeControls = record.get("timeControls") as string | null;
        const ratings = record.get("ratings") as string | null;
        const depth = record.get("depth") as string | null;
        const color = record.get("color") as "white" | "black" | null;

        const parsedPaths = paths.map((path) => {
            const parsedPath = PathSchema.parse(path);
            return parsedPath;
        });

        const repertoireData = {
            paths: parsedPaths,
            timeControls,
            ratings,
            depth,
            color: color ? color : "white",
        };

        return {
            success: true,
            value: repertoireData,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            error: "Sorry. Something went wrong.",
        };
    } finally {
        await session.close();
    }
};

export const createRepertoire = async (
    name: string,
    color: "white" | "black"
): ServerActionResponse<z.infer<typeof RepertoireCreatedSchema>> => {
    const authSession = await auth();

    if (!authSession?.user) {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    const userId = authSession.user.id;
    const id = uuid();

    const session = getNeoSession();
    try {
        const result = await session.run(
            `CREATE (r:Repertoire { 
                id: $id, 
                name: $name, 
                depth: "15", 
                timeControls: "rapid,classical", 
                ratings: "1700,1900,2100", 
                visibility: "private",
                color: $color
            })
            WITH r
            MATCH (u:User { id: $userId })
            CREATE (u)-[:OWNS]->(r)
            RETURN r { .id, .name } AS repertoire`,
            { id, name: name.trim(), userId, color }
        );

        const repertoire = result.records[0].get("repertoire");
        const parsed = RepertoireCreatedSchema.safeParse(repertoire);
        if (!parsed.success) {
            return { success: false, error: "Something went wrong parsing" };
        }

        return { success: true, value: parsed.data };
    } catch (err) {
        console.error("Failed to add repertoire:", err);
        throw new Error("Failed to add repertoire");
    } finally {
        await session.close();
    }
};

export const deleteRepertoire = async (
    id: string
): ServerActionResponse<never> => {
    const authSession = await auth();

    if (!authSession?.user) {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    const userId = authSession.user.id;
    const session = getNeoSession();

    try {
        await session.run(
            `
            MATCH (u: User { id: $userId })
            MATCH (u)-[:OWNS]->(r:Repertoire {id: $id})
            DETACH DELETE r
        `,
            { id, userId }
        );
        return { success: true };
    } catch (err) {
        console.error("Failed to delete repertoire:", err);
        throw new Error("Failed to delete repertoire");
    } finally {
        await session.close();
    }
};

export const updateRepertoireField = async (
    id: string,
    field: "timeControls" | "ratings" | "depth",
    value: string
): ServerActionResponse<never> => {
    const authSession = await auth();

    if (!authSession?.user) {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    const userId = authSession.user.id;
    const session = getNeoSession();

    try {
        const result = await session.run(
            `
            MATCH (u: User { id: $userId })
            MATCH (u)-[:OWNS]->(r: Repertoire {id: $id})
            SET r[$field] = $value
            RETURN r { .id, .name, .${field} } AS repertoire
        `,
            { id, value, field, userId }
        );

        if (result.records.length === 0) {
            return {
                success: false,
                error: "Something went wrong.",
            };
        }

        return {
            success: true,
        };
    } catch (err) {
        console.error(`Failed to update ${field}:`, err);
        throw new Error(`Failed to update ${field}!`);
    } finally {
        await session.close();
    }
};

export const changeRepertoireSettings = async (
    data: RepertoireEditData,
    id: string
): ServerActionResponse<never> => {
    const parsed = RepertoireEditDataSchema.safeParse(data);
    if (!parsed.success) {
        return {
            success: false,
            error: String(parsed.error),
        };
    }

    const authSession = await auth();

    if (!authSession?.user) {
        return {
            success: false,
            error: "Unauthorized",
        };
    }

    const userId = authSession.user.id;
    const { name, visibility, hasAccess, color } = parsed.data;

    const session = getNeoSession();

    try {
        // Step 1: Update name and visibility
        const result = await session.run(
            `
            MATCH (u: User {id: $userId })
            MATCH (u)-[:OWNS]->(r: Repertoire {id: $id})
            SET r.name = $name, r.visibility = $visibility, r.color = $color
            RETURN r
        `,
            { id, name, visibility, userId, color }
        );

        if (!result.records.length) {
            return {
                success: false,
                error: "Repertoire doesn't exist or you're unauthorized.",
            };
        }

        // Step 2: Remove all old access relations
        await session.run(
            `
      MATCH (:Repertoire {id: $id})<-[rel:HAS_EDIT_ACCESS|HAS_READONLY_ACCESS]-(:User)
      DELETE rel
    `,
            { id }
        );

        for (const access of hasAccess) {
            const relType =
                access.mode === "edit"
                    ? "HAS_EDIT_ACCESS"
                    : "HAS_READONLY_ACCESS";

            await session.run(
                `
                MATCH (r:Repertoire {id: $id})
                MATCH (u:User {nickname: $nickname})
                MERGE (u)-[:${relType}]->(r)
                `,
                {
                    id,
                    nickname: access.nickname,
                }
            );
        }

        return {
            success: true,
        };
    } catch (e) {
        console.error("Repertoire update failed:", e);
        return {
            success: false,
            error: "Sorry. Something went wrong.",
        };
    } finally {
        await session.close();
    }
};
