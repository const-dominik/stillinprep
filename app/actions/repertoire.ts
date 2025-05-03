"use server";

import { getSession } from "@/lib/neo4j";
import { v4 as uuid } from "uuid";
import { Path } from "neo4j-driver";
import { PathSchema, RepertoireSchema } from "./schemas";

export async function getRepertoires() {
    const session = getSession();

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

export async function getRepertoire(id: string) {
    const session = getSession();

    try {
        const query = `
            MATCH (r:Repertoire {id: $repertoireId})
            MATCH (r)-[:LEAF]->(leaf:Move)
            MATCH (root:Move {name: "root"})
            MATCH path = (root)-[:IS_PARENT_OF*1..]->(leaf)
            RETURN collect(DISTINCT path) AS paths
        `;
        const result = await session.run(query, {
            repertoireId: id,
        });

        const record = result.records[0];
        const paths = record.get("paths") as Path[];

        const parsedPaths = paths.map((path) => {
            const parsedPath = PathSchema.parse(path);
            return parsedPath;
        });
        return parsedPaths;
    } catch (err) {
        console.error(err);
    } finally {
        await session.close();
    }
}

export async function createRepertoire(name: string) {
    const session = getSession();

    const id = uuid();

    try {
        const result = await session.run(
            `
            CREATE (r:Repertoire { id: $id, name: $name })
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
