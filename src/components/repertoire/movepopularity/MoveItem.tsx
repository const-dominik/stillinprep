import { usePosition } from "@/lib/context/current-position/PositionContext";
import { useRepertoire } from "@/lib/context/repertoire/RepertoireContext";
import { LichessPopularMove } from "@/lib/types/types";
import { setLineOnClick } from "../repertoire-utils";
import { calculateMoveStats } from "./logic";
import ResultsRatio from "./ResultsRatio";
import styles from "./styles/MoveItem.module.scss";

const MoveItem = ({
    move,
    totalGames,
}: {
    move: LichessPopularMove;
    totalGames: number;
}) => {
    const { totalGamesForMove, percentage } = calculateMoveStats(
        move,
        totalGames
    );

    const { setCurrentNode, setLastNode, currentNode } = usePosition();
    const { id: repertoireId } = useRepertoire();

    return (
        <div
            className={styles["popular-move"]}
            onClick={() =>
                setLineOnClick(
                    setCurrentNode,
                    setLastNode,
                    currentNode,
                    move.san,
                    repertoireId
                )
            }
        >
            <div className={styles["move-info"]}>
                <div className={styles["move-data-25"]}>{move.san}</div>
                <div className={styles["move-data-25"]}>
                    {percentage.toFixed(2)}%
                </div>
                <div className={styles["move-data-50"]}>
                    {new Intl.NumberFormat("en-US").format(totalGamesForMove)}
                </div>
            </div>
            <ResultsRatio
                white={move.white}
                black={move.black}
                draws={move.draws}
            />
        </div>
    );
};

export default MoveItem;
