import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";
import { v4 as uuid } from "uuid";

export async function GET() {
    const session = getSession();

    try {
        const result = await session.run(`
        MATCH (r:Repertoire)
        RETURN r { .id, .name } AS repertoire
      `);

        const repertoires = result.records.map((record) =>
            record.get("repertoire")
        );
        return NextResponse.json({ repertoires });
    } catch (err) {
        console.error("Neo4j error:", err);
        return NextResponse.json(
            { error: "Failed to fetch repertoires" },
            { status: 500 }
        );
    } finally {
        await session.close();
    }
}

export async function POST(req: NextRequest) {
    const session = getSession();
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
        );
    }

    const id = uuid();

    try {
        const result = await session.run(
            `
            CREATE (r:Repertoire { id: $id, name: $name })
            RETURN r { .id, .name } AS repertoire`,
            { id, name }
        );

        const repertoire = result.records[0].get("repertoire");
        return NextResponse.json({ repertoire });
    } catch (err) {
        console.error("Failed to add repertoire:", err);
        return NextResponse.json(
            { error: "Failed to add repertoire" },
            { status: 500 }
        );
    } finally {
        await session.close();
    }
}
