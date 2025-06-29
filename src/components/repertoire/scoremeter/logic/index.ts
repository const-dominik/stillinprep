import { StockfishEval } from "@/lib/types/types";

export const calculateScoreUnits = (score: StockfishEval): number => {
    const s = score.value / 100;
    const maxUnits = 3.9;
    const maxScore = 15;

    const raw =
        maxUnits * (Math.log2(1 + Math.abs(s)) / Math.log2(1 + maxScore));

    const scoreUnits = 4 + Math.sign(s) * raw;

    return scoreUnits;
};
