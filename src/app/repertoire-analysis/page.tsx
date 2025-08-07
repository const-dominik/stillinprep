"use client";

import { MovesTreeNode } from "@/components/utils/MovesTree";
import { Pieces } from "@/lib/types/types";
import { FENToChessboard } from "@/lib/utils";
import { useEffect, useState } from "react";

export const create_e4_e5_Nf3 = () => {
    const root = new MovesTreeNode();
    const { node: e4 } = root.addMove(
        Pieces.WHITE_PAWN,
        [6, 4],
        [4, 4],
        FENToChessboard("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: e5 } = e4.addMove(
        Pieces.BLACK_PAWN,
        [1, 4],
        [3, 4],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR")
    );

    const { node: Nf3 } = e5.addMove(
        Pieces.WHITE_KNIGHT,
        [7, 6],
        [5, 5],
        FENToChessboard("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R")
    );

    return [e4, e5, Nf3];
};

const movesTree = create_e4_e5_Nf3();

type ExplorerMove = {
    san: string;
    white: number;
    black: number;
    draws: number;
    avgRating: number;
};

type ExplorerResponse = {
    moves: ExplorerMove[];
    nbGames: number;
    white: number;
    draws: number;
    black: number;
};

const fetchOpeningExplorerStats = async (
    fen: string
): Promise<ExplorerResponse> => {
    const url = `https://explorer.lichess.ovh/lichess?variant=standard&fen=${encodeURIComponent(fen)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Błąd API: ${res.status}`);
    return await res.json();
};

const RepertoireAnalysis = () => {
    const [statsText, setStatsText] = useState("Ładowanie...");

    useEffect(() => {
        const fen =
            "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"; // pozycja po 1.e4

        fetchOpeningExplorerStats(fen)
            .then((data) => {
                if (data.moves.length === 0) {
                    setStatsText("Brak danych dla tej pozycji.");
                    return;
                }
                console.log(data);
                // Tworzymy tekstowy raport
                let text = `Statystyki dla pozycji (FEN): ${fen}\n`;
                text += `Liczba gier: ${data.nbGames}\nRuchy:\n`;
                data.moves.forEach((move) => {
                    const total = move.white + move.black + move.draws;
                    text += `- ${move.san}: zagrano ${total} razy, średni ranking: ${Math.round(move.avgRating)}\n`;
                });

                text += movesTree[0].parent.getFEN() + "\n";
                text += movesTree[0].getFEN() + "\n";
                text += movesTree[1].getFEN() + "\n";
                text += movesTree[2].getFEN() + "\n";

                console.log(movesTree[0].getAllFENs());

                setStatsText(text);
            })
            .catch((err) => {
                setStatsText(`Błąd pobierania danych: ${err.message}`);
            });
    }, []);

    return (
        <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {statsText}
        </div>
    );
};

export default RepertoireAnalysis;
