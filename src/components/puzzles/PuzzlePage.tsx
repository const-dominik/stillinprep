"use client";

import { getRepertoire } from "@/lib/actions/repertoire";
import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { PositionProvider } from "@/lib/context/current-position/PositionContext";
import { RepertoireProvider } from "@/lib/context/repertoire/RepertoireContext";
import { DbGlobalRepertoire, DbRepertoires } from "@/lib/types/backend-types";
import {
    MyOption,
    Puzzle,
    PuzzleFeedback,
    PuzzleMode,
} from "@/lib/types/types";
import { shuffle } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import Chessboard from "../repertoire/chessboard/Chessboard";
import MoveHistory from "../repertoire/history/MoveHistory";
import { createPuzzlesFromTree } from "./logic";
import PuzzleModeChoice from "./PuzzleModeChoice";
import styles from "./PuzzlePage.module.scss";

const createRepertoire = (color: "white" | "black") => ({
    color: color,
    paths: [],
    timeControls: null,
    ratings: null,
    depth: null,
});

const PuzzlePage = ({
    paths,
    repertoires,
}: {
    paths: DbGlobalRepertoire;
    repertoires: DbRepertoires["owned"];
}) => {
    const [globalPuzzles, setGlobalPuzzles] = useState<Puzzle[]>([]);
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [puzzleQueue, setPuzzleQueue] = useState<Puzzle[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<PuzzleFeedback>("go");
    const [mode, setMode] = useState<PuzzleMode>("global");
    const [repertoire, setRepertoire] = useState<MyOption | null>(null);
    const [waiting, setWaiting] = useState(false);

    const { white, black } = paths;

    useEffect(() => {
        const whitePuzzles = createPuzzlesFromTree(white, "white");
        const blackPuzzles = createPuzzlesFromTree(black, "black");
        const allPuzzles = shuffle([...whitePuzzles, ...blackPuzzles]);

        setGlobalPuzzles(allPuzzles);
    }, [white, black]);

    useEffect(() => {
        const getRepertoireFromDb = async (repertoireId: string) => {
            setWaiting(true);
            try {
                const data = await getRepertoire(repertoireId);
                console.log(data);
                if (data.success && data.value) {
                    const puzzles = createPuzzlesFromTree(
                        data.value.paths,
                        data.value.color
                    );
                    console.log(puzzles);
                    const shuffledPuzzles = shuffle(puzzles);

                    setPuzzleQueue(shuffledPuzzles);
                    setPuzzle(shuffledPuzzles[0] || null);
                    setCurrentIndex(0);
                }
            } catch (error) {
                console.error("Error fetching repertoire:", error);
            } finally {
                setWaiting(false);
            }
        };

        if (mode === "global" && globalPuzzles.length > 0) {
            const shuffledPuzzles = shuffle([...globalPuzzles]);
            setPuzzleQueue(shuffledPuzzles);
            setPuzzle(shuffledPuzzles[0] || null);
            setCurrentIndex(0);
            setWaiting(false);
        } else if (mode === "repertoire" && repertoire) {
            getRepertoireFromDb(repertoire.value);
        }
    }, [mode, repertoire, globalPuzzles]);

    const shuffleAndRestartPuzzles = useCallback((puzzles: Puzzle[]) => {
        const shuffled = shuffle([...puzzles]);
        setPuzzleQueue(shuffled);
        setPuzzle(shuffled[0] || null);
        setCurrentIndex(0);
    }, []);

    const nextPuzzle = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < puzzleQueue.length) {
            setCurrentIndex(nextIndex);
            setPuzzle(puzzleQueue[nextIndex]);
        } else {
            shuffleAndRestartPuzzles(puzzleQueue);
        }
    };

    if (!puzzle) {
        return <div>No more puzzles!</div>;
    }

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
                        {waiting}
                        <MoveHistory mode="puzzle" />
                        <Chessboard
                            mode="puzzle"
                            puzzleTree={puzzle}
                            feedbackFunction={setFeedback}
                            feedback={feedback}
                        />
                        <PuzzleModeChoice
                            mode={mode}
                            setMode={setMode}
                            repertoires={repertoires}
                            repertoire={repertoire}
                            setRepertoires={setRepertoire}
                        />
                    </div>
                </PositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};

export default PuzzlePage;
