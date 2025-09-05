"use client";

import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { PositionProvider } from "@/lib/context/current-position/PositionContext";
import { RepertoireProvider } from "@/lib/context/repertoire/RepertoireContext";
import { DbGlobalRepertoire, DbRepertoires } from "@/lib/types/backend-types";
import { SpacedPuzzleData } from "@/lib/types/types";
import Chessboard from "../repertoire/chessboard/Chessboard";
import MoveHistory from "../repertoire/history/MoveHistory";
import { MovesTreeNode } from "../utils/MovesTree";
import { Back } from "../utils/Utils";
import { createRepertoire, usePuzzleManager } from "./logic";
import PuzzleInfo from "./PuzzleInfo";
import PuzzleModeChoice from "./PuzzleModeChoice";
import styles from "./styles/PuzzlePage.module.scss";

const basePuzzle = {
    color: "white" as const,
    root: new MovesTreeNode(),
    startingNode: new MovesTreeNode(),
    targetNode: new MovesTreeNode(),
    solution: [],
    newLeaf: null,
};

const PuzzlePage = ({
    paths,
    repertoires,
    spacedData,
}: {
    paths: DbGlobalRepertoire;
    repertoires: DbRepertoires["owned"];
    spacedData: SpacedPuzzleData;
}) => {
    const {
        mode,
        setMode,
        repertoire,
        setRepertoire,
        currentPuzzle,
        feedback,
        handleFeedback,
        nextPuzzle,
        autoSkip,
        setAutoSkip,
        loading,
        puzzlesNotLoaded,
        spacedPuzzlesRemaining,
    } = usePuzzleManager(paths, spacedData);

    const puzzle = currentPuzzle || basePuzzle;

    return (
        <ConfirmProvider>
            <RepertoireProvider
                repertoireId="mock"
                repertoireData={createRepertoire(puzzle.color)}
            >
                <PositionProvider puzzle={puzzle}>
                    <div>
                        <Back url="/mode" />

                        <div className={styles.container}>
                            <MoveHistory mode="puzzle" />
                            <Chessboard
                                mode="puzzle"
                                puzzleTree={puzzle}
                                feedbackFunction={handleFeedback}
                                feedback={feedback}
                            />
                            <div className={styles["right-sidebar"]}>
                                <PuzzleModeChoice
                                    mode={mode}
                                    setMode={setMode}
                                    repertoires={repertoires}
                                    repertoire={repertoire}
                                    setRepertoire={setRepertoire}
                                    spacedPuzzlesAmount={spacedPuzzlesRemaining}
                                />
                                <PuzzleInfo
                                    puzzle={puzzle}
                                    feedback={feedback}
                                    autoSkip={autoSkip}
                                    setAutoSkip={setAutoSkip}
                                    nextPuzzle={nextPuzzle}
                                    waiting={loading}
                                    puzzlesNotLoaded={puzzlesNotLoaded}
                                    repertoireLoading={loading}
                                />
                            </div>
                        </div>
                    </div>
                </PositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};

export default PuzzlePage;
