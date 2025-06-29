import { LichessPopularMove } from "@/lib/types/types";
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

    return (
        <div className={styles["popular-move"]}>
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
