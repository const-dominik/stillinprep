"use server";

import { getNeoSession } from "../neo4j";
import { CompleteProfileArgs } from "../schema";
import { ServerActionResponse } from "../types/backend-types";

const errors = {
    parsing: "Error parsing data.",
    taken: "Nickname is taken.",
    somethingWrong: "Sorry, something went wrong.",
};

export const completeProfile = async (
    id: string,
    nickname: string
): ServerActionResponse<never> => {
    const parsed = CompleteProfileArgs.safeParse({ id, nickname });

    if (!parsed.success) {
        return {
            success: false,
            error: errors["parsing"],
        };
    }

    const query = `
        MATCH (u:User { id: $id })
        WHERE u.nickname IS NULL
        AND NOT EXISTS {
            MATCH (other:User { nickname: $nickname })
            WHERE other.id <> $id
        }
        SET u.nickname = $nickname
        RETURN u
    `;
    const session = getNeoSession();

    try {
        const result = await session.run(query, {
            id,
            nickname,
        });

        const records = result.records;

        if (records.length === 0) {
            return {
                success: false,
                error: errors["taken"],
            };
        }

        return { success: true, message: "Completed!" };
    } catch {
        return { success: false, error: errors["somethingWrong"] };
    } finally {
        await session.close();
    }
};
