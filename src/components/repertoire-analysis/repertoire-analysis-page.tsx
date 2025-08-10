// TO DO USUNIECIA ALE ZOSTAWIAM JAKBYS MUSIAL COS TU TESTOWAC

// "use client";

// import { SelectRepertoire } from "@/components/utils/Utils";
// import { getRepertoire } from "@/lib/actions/repertoire";
// import { DbRepertoires } from "@/lib/types/backend-types";
// import { ExplorerOptions, MyOption } from "@/lib/types/types";
// import { useEffect, useState } from "react";
// import { flattenResult, mergePathsIntoTree } from "../utils/parseDbResponse";
// import { getRepertoireFeedback } from "./logic";

// type Props = {
//     repertoires: DbRepertoires["owned"];
// };

// const RepertoireAnalysis = ({ repertoires }: Props) => {
//     const [statsText, setStatsText] = useState("Choose repertoire");
//     const [repertoire, setRepertoire] = useState<MyOption | null>(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!repertoire?.value) return;

//         const fetchData = async () => {
//             setLoading(true);
//             setStatsText(
//                 `Wybrany repertuar: ${repertoire.label || repertoire.value}`
//             );

//             try {
//                 const data = await getRepertoire(repertoire.value);
//                 if (data.success && data.value) {
//                     const [root] = mergePathsIntoTree(
//                         flattenResult(data.value.paths)
//                     );

//                     if (data.value.color === "white") {
//                         const moves: [string, number][] = [];
//                         const explorerOptions: ExplorerOptions = {
//                             variant: "standard",
//                             fen: root.getFEN(),
//                             speeds: ["rapid"],
//                             ratings: [1600, 1800],
//                         };

//                         // Pobranie ruchów z feedbacku
//                         const movesOfChilds = await getRepertoireFeedback(
//                             root,
//                             explorerOptions
//                         );
//                         moves.push(...movesOfChilds);

//                         // Sortowanie i dopisywanie do tekstu
//                         moves.sort((a, b) => b[1] - a[1]);
//                         const movesText = moves
//                             .map(
//                                 ([move, prob]) =>
//                                     `\nProbability: ${prob}, move order: ${move}`
//                             )
//                             .join("");

//                         setStatsText((prev) => prev + movesText);
//                     }
//                 }
//             } catch (err: any) {
//                 setStatsText(`Błąd pobierania danych: ${err.message}`);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [repertoire]);

//     return (
//         <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
//             <SelectRepertoire
//                 instanceId="repertoire-select-analysis"
//                 repertoires={repertoires}
//                 chosenRepertoire={repertoire}
//                 setRepertoire={setRepertoire}
//             />
//             {loading ? "\nLoading..." : `\n${statsText}`}
//         </div>
//     );
// };

// export default RepertoireAnalysis;
