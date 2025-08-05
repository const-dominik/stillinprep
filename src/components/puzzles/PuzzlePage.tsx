"use client";

import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { PositionProvider } from "@/lib/context/current-position/PositionContext";
import { RepertoireProvider } from "@/lib/context/repertoire/RepertoireContext";
import { DbGlobalRepertoire, DbRepertoires } from "@/lib/types/backend-types";
import { MyOption, Puzzle, PuzzleMode } from "@/lib/types/types";
import { useEffect, useState } from "react";
import Chessboard from "../repertoire/chessboard/Chessboard";
import MoveHistory from "../repertoire/history/MoveHistory";
import { MovesTreeNode } from "../utils/MovesTree";
import PuzzleInfo from "./PuzzleInfo";
import PuzzleModeChoice from "./PuzzleModeChoice";
import styles from "./PuzzlePage.module.scss";
import {
    createRepertoire,
    useAutoSkip,
    useGlobalPuzzles,
    usePuzzleQueue,
    useRepertoirePuzzles,
} from "./logic";

const basePuzzle: Puzzle = {
    color: "white",
    root: new MovesTreeNode(),
    startingNode: new MovesTreeNode(),
    targetNode: new MovesTreeNode(),
    solution: [],
    newLeaf: null,
};

const PuzzlePage = ({
    paths,
    repertoires,
}: {
    paths: DbGlobalRepertoire;
    repertoires: DbRepertoires["owned"];
}) => {
    const [mode, setMode] = useState<PuzzleMode>("global");
    const [repertoire, setRepertoire] = useState<MyOption | null>(null);

    const globalPuzzles = useGlobalPuzzles(paths);

    const { fetchRepertoirePuzzles, loading: repertoireLoading } =
        useRepertoirePuzzles();
    const {
        currentPuzzle,
        feedback,
        setFeedback,
        nextPuzzle,
        loadPuzzles,
        resetFeedback,
    } = usePuzzleQueue();
    const { autoSkip, setAutoSkip } = useAutoSkip(feedback, nextPuzzle);

    useEffect(() => {
        const loadPuzzlesForMode = async () => {
            if (mode === "global" && globalPuzzles.length > 0) {
                loadPuzzles(globalPuzzles);
            } else if (mode === "repertoire" && repertoire) {
                const puzzles = await fetchRepertoirePuzzles(repertoire.value);
                if (puzzles.length > 0) {
                    loadPuzzles(puzzles);
                }
            }
        };

        loadPuzzlesForMode();
    }, [mode, repertoire, globalPuzzles, loadPuzzles, fetchRepertoirePuzzles]);

    useEffect(() => {
        resetFeedback();
    }, [currentPuzzle, resetFeedback]);

    const puzzle = currentPuzzle || basePuzzle;

    return (
        <ConfirmProvider>
            <RepertoireProvider
                repertoireId="mock"
                repertoireData={createRepertoire(puzzle.color)}
            >
                <PositionProvider
                    passedRoot={puzzle.root}
                    passedLast={puzzle.startingNode}
                >
                    <div className={styles.container}>
                        <MoveHistory mode="puzzle" />
                        <Chessboard
                            mode="puzzle"
                            puzzleTree={puzzle}
                            feedbackFunction={setFeedback}
                            feedback={feedback}
                        />
                        <div>
                            <PuzzleModeChoice
                                mode={mode}
                                setMode={setMode}
                                repertoires={repertoires}
                                repertoire={repertoire}
                                setRepertoires={setRepertoire}
                            />
                            <PuzzleInfo
                                puzzle={puzzle}
                                feedback={feedback}
                                autoSkip={autoSkip}
                                setAutoSkip={setAutoSkip}
                                nextPuzzle={nextPuzzle}
                                waiting={repertoireLoading}
                                puzzlesNotLoaded={!currentPuzzle}
                                repertoireLoading={repertoireLoading}
                            />
                        </div>
                    </div>
                </PositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};
export default PuzzlePage;
