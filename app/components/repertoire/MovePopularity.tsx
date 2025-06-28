import { useEffect, useState } from "react";
import { MovesTreeNode } from "./utils/MovesTree";
import styles from "./styles.module.scss";
import {
    DbType,
    LiDbAvgRating,
    MovePopualritySettings,
    TimeControl,
} from "@/app/types/types";
import LichessDbSettings from "./LichessDbSettings";
import { CiSettings } from "react-icons/ci";
import { useDebounce } from "use-debounce";
import { z } from "zod/v4";
import { LichessMovePopularityResponse } from "./utils/schemas";
import { getPopularMoves } from "./utils/movePopularity";
import { moveToMoveHistory } from "@/app/utils";
import ResultsRatio from "./ResultsRatio";

const MovePopularity = ({
    currentNode,
    timeControls,
    ratings,
    repertoireId,
}: {
    currentNode: MovesTreeNode;
    timeControls: TimeControl[];
    ratings: LiDbAvgRating[];
    repertoireId: string;
}) => {
    const [db, setDb] = useState<DbType>("players");
    const [settings, setSettings] = useState<MovePopualritySettings>({
        timeControls: timeControls,
        ratings: ratings,
    });
    const [toggleSettings, setToggleSettings] = useState(false);
    const [popularMoves, setPopularMoves] = useState<z.infer<
        typeof LichessMovePopularityResponse
    > | null>(null);

    const [debouncedCurrentNode] = useDebounce(currentNode, 150);
    const [debouncedSettings] = useDebounce(settings, 300);

    useEffect(() => {
        const getMoves = async () => {
            const moves = await getPopularMoves(
                db,
                debouncedSettings,
                moveToMoveHistory(debouncedCurrentNode, ",")
            );
            setPopularMoves(moves);
        };
        setPopularMoves(null);
        getMoves();
    }, [debouncedCurrentNode, debouncedSettings, db]);

    const activeOptionClasses = [
        styles["db-option"],
        styles["active-db-option"],
    ].join(" ");

    const isPlayersDb = db === "players";

    return (
        <div className={styles["move-popularity"]}>
            <div className={styles["popular-moves-title"]}>Popular moves</div>
            <div className={styles["opening-name"]}>
                {popularMoves?.opening && popularMoves.opening.name}
            </div>
            <div className={styles["db-options"]}>
                <div
                    className={
                        isPlayersDb ? activeOptionClasses : styles["db-option"]
                    }
                    onClick={() => setDb("players")}
                >
                    Players
                    {isPlayersDb && (
                        <CiSettings
                            className={styles["toggle-settings"]}
                            onClick={() => setToggleSettings((p) => !p)}
                        />
                    )}
                </div>
                <div
                    className={
                        !isPlayersDb ? activeOptionClasses : styles["db-option"]
                    }
                    onClick={() => setDb("masters")}
                >
                    Masters
                </div>
            </div>
            {db === "players" && toggleSettings && (
                <LichessDbSettings
                    repertoireId={repertoireId}
                    settings={settings}
                    setSettings={setSettings}
                />
            )}
            {popularMoves && !toggleSettings && (
                <div className={styles["popular-moves-container"]}>
                    {popularMoves.moves.map((move) => {
                        const totalGames =
                            popularMoves.black +
                            popularMoves.draws +
                            popularMoves.white;
                        const totalGamesForMove =
                            move.black + move.draws + move.white;
                        const percentage =
                            (totalGamesForMove / totalGames) * 100;

                        return (
                            <div
                                className={styles["popular-move"]}
                                key={move.san}
                            >
                                <div className={styles["move-info"]}>
                                    <div className={styles["move-data-25"]}>
                                        {move.san}
                                    </div>
                                    <div className={styles["move-data-25"]}>
                                        {percentage.toFixed(2)}%
                                    </div>
                                    <div className={styles["move-data-50"]}>
                                        {new Intl.NumberFormat("en-US").format(
                                            totalGamesForMove
                                        )}
                                    </div>
                                </div>
                                <div className={styles["ratio"]}>
                                    <ResultsRatio
                                        white={move.white}
                                        black={move.black}
                                        draws={move.draws}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {popularMoves.moves.length === 0 && (
                        <div className={styles["no-move-info"]}>
                            No results for this position. You might be making
                            history!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MovePopularity;
