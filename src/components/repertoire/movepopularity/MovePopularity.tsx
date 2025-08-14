import { usePosition } from "@/lib/context/current-position/PositionContext";
import {
    DbType,
    LichessResponse,
    MovePopualritySettings,
} from "@/lib/types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { useDebounce } from "use-debounce";
import LichessDbSettings from "./LichessDbSettings";
import { getPopularMoves } from "./logic";
import MoveItem from "./MoveItem";
import styles from "./styles/MovePopularity.module.scss";

const MovePopularity = ({
    settings,
    setSettings,
}: {
    settings: MovePopualritySettings;
    setSettings: Dispatch<SetStateAction<MovePopualritySettings>>;
}) => {
    const { currentNode } = usePosition();

    const [db, setDb] = useState<DbType>("players");

    const [toggleSettings, setToggleSettings] = useState(false);
    const [popularMoves, setPopularMoves] = useState<LichessResponse | null>(
        null
    );

    const [debouncedCurrentNode] = useDebounce(currentNode, 150);
    const [debouncedSettings] = useDebounce(settings, 300);

    useEffect(() => {
        const getMoves = async () => {
            const moves = await getPopularMoves(
                db,
                debouncedSettings,
                currentNode
            );
            setPopularMoves(moves);
        };
        setPopularMoves(null);
        getMoves();
    }, [debouncedCurrentNode, debouncedSettings, db, currentNode]);

    const activeOptionClasses = [
        styles["db-option"],
        styles["active-db-option"],
    ].join(" ");

    const getDbOptionClass = (isActive: boolean) =>
        isActive ? activeOptionClasses : styles["db-option"];

    const isPlayersDb = db === "players";

    return (
        <div className={styles["move-popularity"]}>
            <div className={styles["popular-moves-title"]}>Popular moves</div>
            <div className={styles["opening-name"]}>
                {popularMoves?.opening && popularMoves.opening.name}
            </div>
            <div className={styles["db-options"]}>
                <div
                    className={getDbOptionClass(isPlayersDb)}
                    onClick={() => setDb("players")}
                >
                    Players
                    {isPlayersDb && (
                        <CiSettings
                            className={styles["toggle-settings"]}
                            data-testid="ci-settings-icon"
                            onClick={() => setToggleSettings((p) => !p)}
                        />
                    )}
                </div>
                <div
                    className={getDbOptionClass(!isPlayersDb)}
                    onClick={() => setDb("masters")}
                >
                    Masters
                </div>
            </div>
            {db === "players" && toggleSettings && (
                <LichessDbSettings
                    settings={settings}
                    setSettings={setSettings}
                />
            )}
            {popularMoves && (!toggleSettings || db === "masters") && (
                <div className={styles["popular-moves-container"]}>
                    {popularMoves.moves.map((move) => {
                        const totalGames =
                            popularMoves.black +
                            popularMoves.draws +
                            popularMoves.white;

                        return (
                            <MoveItem
                                move={move}
                                totalGames={totalGames}
                                key={move.san}
                            />
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
