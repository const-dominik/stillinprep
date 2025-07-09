"use server";

import { getNeoSession } from "@/lib/neo4j";
import { Path } from "neo4j-driver";
import { v4 as uuid } from "uuid";
import { PathSchema, RepertoireSchema } from "../schema";
import {
    DbRepertoireResponse,
    DbRepertoiresResponse,
} from "../types/backend-types";

export async function getRepertoires(): DbRepertoiresResponse {
    const session = getNeoSession();

    try {
        const result = await session.run(`
        MATCH (r:Repertoire)
        RETURN r { .id, .name } AS repertoire
      `);

        const repertoires = result.records.map((record) => {
            const repertoire = record.get("repertoire");
            const parsedRepertoire = RepertoireSchema.parse(repertoire);

            return parsedRepertoire;
        });
        return repertoires;
    } catch (err) {
        console.error("Neo4j error:", err);
        throw new Error("Failed to fetch repertoires");
    } finally {
        await session.close();
    }
}

export async function getRepertoire(id: string): DbRepertoireResponse {
    if (process.env.TEST_ENV === "true") {
        return {
            timeControls: "rapid",
            ratings: "1700",
            depth: "15",
            paths: [],
        };
    }

    const session = getNeoSession();

    try {
        const query = `
            MATCH (r:Repertoire {id: $repertoireId})
            OPTIONAL MATCH (r)-[:LEAF]->(leaf:Move)
            MATCH (root:Move {name: "root"})
            OPTIONAL MATCH path = (root)-[:IS_PARENT_OF*1..]->(leaf)
            RETURN
                collect(DISTINCT path) AS paths,
                r.timeControls AS timeControls,
                r.ratings AS ratings,
                r.depth AS depth
        `;

        const result = await session.run(query, {
            repertoireId: id,
        });

        const record = result.records[0];

        if (!record) {
            return undefined;
        }

        const paths = record.get("paths") as Path[];
        const timeControls = record.get("timeControls") as string | null;
        const ratings = record.get("ratings") as string | null;
        const depth = record.get("depth") as string | null;

        const parsedPaths = paths.map((path) => {
            const parsedPath = PathSchema.parse(path);
            return parsedPath;
        });

        const repertoireData = {
            paths: parsedPaths,
            timeControls,
            ratings,
            depth,
        };

        return repertoireData;
    } catch (err) {
        console.error(err);
    } finally {
        await session.close();
    }
}

export async function createRepertoire(name: string) {
    const session = getNeoSession();

    const id = uuid();

    try {
        const result = await session.run(
            `
            CREATE (r:Repertoire { id: $id, name: $name, depth: "15", timeControls: "rapid,classical", ratings: "1700,1900,2100" })
            RETURN r { .id, .name } AS repertoire`,
            { id, name: name.trim() }
        );

        const repertoire = result.records[0].get("repertoire");
        return RepertoireSchema.parse(repertoire);
    } catch (err) {
        console.error("Failed to add repertoire:", err);
        throw new Error("Failed to add repertoire");
    } finally {
        await session.close();
    }
}

export async function deleteRepertoire(id: string) {
    const session = getNeoSession();

    try {
        await session.run(
            `
            MATCH (r:Repertoire {id: $id})
            DETACH DELETE r
        `,
            { id }
        );
        return { success: true };
    } catch (err) {
        console.error("Failed to delete repertoire:", err);
        throw new Error("Failed to delete repertoire");
    } finally {
        await session.close();
    }
}

export async function updateRepertoireField(
    id: string,
    field: "timeControls" | "ratings" | "depth" | "name",
    value: string
) {
    const session = getNeoSession();

    try {
        const result = await session.run(
            `
      MATCH (r: Repertoire {id: $id})
      SET r[$field] = $value
      RETURN r { .id, .name, .${field} } AS repertoire
      `,
            { id, value, field }
        );

        return result.records[0]?.get("repertoire") ?? null;
    } catch (err) {
        console.error(`Failed to update ${field}:`, err);
        throw new Error(`Failed to update ${field}!`);
    } finally {
        await session.close();
    }
}
