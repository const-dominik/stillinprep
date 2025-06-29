import { ParsedLine, Player } from "@/lib/types/types";

export const parseStockfishLine = (
    line: string,
    currentPlayer: Player
): ParsedLine | null => {
    if (!line.startsWith("info")) return null;

    const result: ParsedLine = {};

    const depthMatch = line.match(/\bdepth (\d+)/);
    if (depthMatch) result.depth = parseInt(depthMatch[1], 10);

    const seldepthMatch = line.match(/\bseldepth (\d+)/);
    if (seldepthMatch) result.seldepth = parseInt(seldepthMatch[1], 10);

    const multipvMatch = line.match(/\bmultipv (\d+)/);
    if (multipvMatch) result.multipv = parseInt(multipvMatch[1], 10);

    const scoreMatch = line.match(/\bscore (cp|mate) (-?\d+)/);
    if (scoreMatch) {
        result.score = {
            type: scoreMatch[1] as "cp" | "mate",
            value: parseInt(scoreMatch[2], 10),
        };

        // in UCI, evaluation is relative to the player -
        // if black is to move and score is positive, it means that black is winning
        // we want score to always be relative to white

        if (currentPlayer === "black") {
            result.score.value *= -1;
        }
    }

    const pvMatch = line.match(/\bpv (.+)/);
    if (pvMatch) {
        result.pv = pvMatch[1].trim().split(/\s+/);
    }

    return result;
};
