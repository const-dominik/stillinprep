"use client";

import { SelectRepertoire } from "@/components/utils/Utils";
import { getRepertoire } from "@/lib/actions/repertoire";
import { DbRepertoires } from "@/lib/types/backend-types";
import { MyOption } from "@/lib/types/types";
import { useEffect, useState } from "react";
import { flattenResult, mergePathsIntoTree } from "../utils/parseDbResponse";
import { getRepertoireFeedback } from "./logic";

const RepertoireAnalysis = ({
    repertoires,
}: {
    repertoires: DbRepertoires["owned"];
}) => {
    const [statsText, setStatsText] = useState("Choose repertoire");
    const [repertoire, setRepertoire] = useState<MyOption | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let text = "dupa";
                if (repertoire?.value) {
                    const data = await getRepertoire(repertoire?.value);
                    if (data.success && data.value) {
                        setStatsText(text);
                    }
                }
            } catch (err: any) {
                setStatsText(`Błąd pobierania danych: ${err.message}`);
            }
        };

        fetchData();
    }, []);

    // Gdy zmienia się repertoire, dopisujemy info do tekstu
    useEffect(() => {
        if (repertoire) {
            setStatsText(
                `Wybrany repertuar: ${repertoire.label || repertoire.value}`
            );

            const fetchData = async () => {
                try {
                    if (repertoire?.value) {
                        const data = await getRepertoire(repertoire?.value);
                        if (data.success && data.value) {
                            const [root] = mergePathsIntoTree(
                                flattenResult(data.value.paths)
                            );
                            if (data.value.color === "white") {
                                const moves: [string, number][] = [];
                                for (const child of [root]) {
                                    const movesOfChilds =
                                        await getRepertoireFeedback(child);
                                    moves.push(...movesOfChilds);
                                }

                                moves.sort((a, b) => b[1] - a[1]);

                                for (const move of moves) {
                                    setStatsText(
                                        (prev) =>
                                            prev +
                                            `\nProbality: ${move[1]}, move order: ${move[0]}`
                                    );
                                }
                            }
                        }
                    }
                } catch (err: any) {
                    setStatsText(`Błąd pobierania danych: ${err.message}`);
                }
            };

            fetchData();
        }
    }, [repertoire]);

    return (
        <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            <SelectRepertoire
                repertoires={repertoires}
                chosenRepertoire={repertoire}
                setRepertoire={setRepertoire}
            />
            {statsText}
        </div>
    );
};

export default RepertoireAnalysis;
