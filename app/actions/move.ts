"use server";

import { getSession } from "@/lib/neo4j";
import { AlgebraicPromotionPieces, PiecePosition } from "../types";
import { Session } from "neo4j-driver";

type MoveData = {
    parent: string;
    repertoire: string;
    move: {
        name: string;
        from: PiecePosition;
        to: PiecePosition;
        promotion: AlgebraicPromotionPieces | null;
        id: string;
    };
};

async function createLeafRelation(
    repertoire: string,
    parentId: string,
    nodeId: string,
    session: Session
) {
    const query = `
        MATCH (r: Repertoire {id: $repertoireId})
        MATCH (n: Move {id: $nodeId})
        MATCH (p: Move {id: $parentId})
        OPTIONAL MATCH (r)-[rel:LEAF]->(p)
        DELETE rel
        CREATE (r)-[:LEAF]->(n)
    `;

    await session.run(query, {
        repertoireId: repertoire,
        parentId,
        nodeId,
    });
}

export async function addMove(moveData: MoveData) {
    const session = getSession();
    const move = moveData.move;
    const query = `
        OPTIONAL MATCH (p:Move {id: $parentId})
        MERGE (m:Move {id: $id})
        ON CREATE SET
            m.name = $name,
            m.from = $from,
            m.to = $to,
            m.promotion = $promotion
        WITH p, m
        WHERE p IS NOT NULL
        MERGE (p)-[:IS_PARENT_OF]->(m)
        RETURN m { .id, .name } AS move
    `;

    try {
        await session.run(query, {
            parentId: moveData.parent,
            id: move.id,
            name: move.name,
            from: move.from,
            to: move.to,
            promotion: move.promotion ?? "x",
        });
        await createLeafRelation(
            moveData.repertoire,
            moveData.parent,
            move.id,
            session
        );
    } catch (err) {
        console.log(err);
    } finally {
        await session.close();
    }
}
