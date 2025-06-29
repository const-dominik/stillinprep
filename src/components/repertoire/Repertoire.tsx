"use client";

import Chessboard from "@/components/repertoire/chessboard/Chessboard";
import MoveHistory from "@/components/repertoire/history/MoveHistory";
import MovePopularity from "@/components/repertoire/movepopularity/MovePopularity";
import ScoreMeter from "@/components/repertoire/scoremeter/ScoreMeter";
import StockfishAnalysis from "@/components/repertoire/stockfish/StockfishAnalysis";
import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { useStockfish } from "@/lib/hooks/useStockfish";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { DbRepertoire } from "@/lib/types/backend-types";
import { LiDbAvgRating } from "@/lib/types/types";
import {
    flattenResult,
    getDepth,
    getRatings,
    getTimeControls,
    mergePathsIntoTree,
} from "../utils/parseDbResponse";
import styles from "./Repertoire.module.scss";

const Repertoire = ({
    repertoireId,
    repertoireData,
}: {
    repertoireId: string;
    repertoireData: DbRepertoire;
}) => {
    const { paths, timeControls, ratings, depth } = repertoireData;

    const flattened = flattenResult(paths);
    const parsedTimeControls = getTimeControls(timeControls);
    const parsedRatings: LiDbAvgRating[] = getRatings(ratings);
    const parsedDepth = getDepth(depth);

    const [root, last] = mergePathsIntoTree(flattened);
    const [currentNode, setCurrentNode] = useState(root);
    const [lastNode, setLastNode] = useState(last);

    const [debouncedNode] = useDebounce(currentNode, 350);
    const stockfish = useStockfish(debouncedNode, parsedDepth);

    const score = stockfish.multiPV[0]?.line.score;

    return (
        <ConfirmProvider>
            <div className={styles["container"]}>
                <div className={styles["moves-info"]}>
                    <StockfishAnalysis
                        stockfish={stockfish}
                        currentNode={currentNode}
                        repertoireId={repertoireId}
                    />
                    <MovePopularity
                        currentNode={currentNode}
                        timeControls={parsedTimeControls}
                        ratings={parsedRatings}
                        repertoireId={repertoireId}
                    />
                </div>
                <ScoreMeter score={score} />
                <Chessboard
                    currentNode={currentNode}
                    lastNode={lastNode}
                    setCurrentNode={setCurrentNode}
                    setLastNode={setLastNode}
                    repertoireId={repertoireId}
                />
                <MoveHistory
                    currentNode={currentNode}
                    lastNode={lastNode}
                    setCurrentNode={setCurrentNode}
                    setLastNode={setLastNode}
                    repertoireId={repertoireId}
                />
            </div>
        </ConfirmProvider>
    );
};

export default Repertoire;
