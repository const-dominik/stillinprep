"use server";

import { auth } from "../auth";
import { getNeoSession } from "../neo4j";
import { SpacedPuzzleDataSchema } from "../schema";
import { ServerActionResponse } from "../types/backend-types";
import { SpacedPuzzleData } from "../types/types";

export const getSpacedRepetitionData =
    async (): ServerActionResponse<SpacedPuzzleData> => {
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
            MATCH (user:User {id: $userId})
            MERGE (user)-[:HAS_PUZZLE_PROGRESS]->(progress:PuzzleProgress)
            ON CREATE SET 
                progress.puzzles = '{}'
            RETURN progress`;

            const result = await session.run(query, {
                userId,
            });

            const record = result.records[0];
            const progress = record.get("progress");

            const parsedProgress = SpacedPuzzleDataSchema.parse(
                progress.properties
            );

            return {
                success: true,
                value: parsedProgress,
            };
        } catch (e) {
            console.log(e);
            return { success: false, error: String(e) };
        } finally {
            await session.close();
        }
    };

const grade = (mistakes: number) => {
    if (mistakes <= 3) return 5 - mistakes;
    return 1;
};

export const saveSpacedRepetitionData = async (
    puzzleResult: Record<string, number>
) => {
    const currentData = await getSpacedRepetitionData();
    if (!currentData.success || !currentData.value) {
        return currentData;
    }

    const data: SpacedPuzzleData = currentData.value;
    const puzzles = data.puzzles;

    const now = new Date();

    for (const [nodeId, mistakes] of Object.entries(puzzleResult)) {
        const g = grade(mistakes);
        let puzzle = puzzles[nodeId];

        if (!puzzle) {
            puzzle = {
                next_attempt: now.toISOString(),
                ease_factor: 2.5,
                interval: 0,
                repetition: 0,
            };
        }

        let { repetition = 0, interval = 0, ease_factor: EF } = puzzle;

        if (g >= 3) {
            if (repetition === 0) interval = 1;
            else if (repetition === 1) interval = 6;
            else interval = Math.round(interval * EF);

            EF = Number(
                (EF + (0.1 - (5 - g) * (0.08 + (5 - g) * 0.02))).toFixed(6)
            );
            if (EF < 1.3) EF = 1.3;
            repetition++;
        } else {
            repetition = 0;
            interval = 1;
            EF = Math.max(1.3, EF - 0.2);
        }

        const nextAttemptDate = new Date(now);
        nextAttemptDate.setDate(nextAttemptDate.getDate() + interval);

        puzzles[nodeId] = {
            next_attempt: nextAttemptDate.toISOString(),
            ease_factor: EF,
            interval,
            repetition,
        };
    }

    return await setSpacedRepetitionData(puzzles);
};

export const setSpacedRepetitionData = async (
    puzzles: SpacedPuzzleData["puzzles"]
): Promise<ServerActionResponse<SpacedPuzzleData>> => {
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
            MATCH (user:User {id: $userId})-[:HAS_PUZZLE_PROGRESS]->(progress:PuzzleProgress)
            SET progress.puzzles = $puzzles
            RETURN progress
        `;

        await session.run(query, {
            userId,
            puzzles: JSON.stringify(puzzles),
        });

        return {
            success: true,
        };
    } catch (e) {
        console.error(e);
        return { success: false, error: String(e) };
    } finally {
        await session.close();
    }
};
