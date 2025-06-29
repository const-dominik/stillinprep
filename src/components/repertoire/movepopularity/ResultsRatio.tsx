import styles from "./styles/ResultsRatio.module.scss";

const ResultsRatio = ({
    white,
    black,
    draws,
}: {
    white: number;
    black: number;
    draws: number;
}) => {
    const total = white + black + draws;
    const whitePercent = (white / total) * 100;
    const drawsPercent = (draws / total) * 100;
    const blackPercent = (black / total) * 100;

    return (
        <div className={styles.bar}>
            {whitePercent > 0 && (
                <div
                    className={styles.white}
                    style={{ flexBasis: `${whitePercent}%` }}
                    title={`${whitePercent.toFixed(2)}%`}
                >
                    {whitePercent >= 25 && `${whitePercent.toFixed(2)}%`}
                </div>
            )}

            {drawsPercent > 0 && (
                <div
                    className={styles.draw}
                    style={{ flexBasis: `${drawsPercent}%` }}
                    title={`${drawsPercent.toFixed(2)}%`}
                >
                    {drawsPercent >= 25 && `${drawsPercent.toFixed(2)}%`}
                </div>
            )}

            {blackPercent > 0 && (
                <div
                    className={styles.black}
                    style={{ flexBasis: `${blackPercent}%` }}
                    title={`${blackPercent.toFixed(2)}%`}
                >
                    {blackPercent >= 25 && `${blackPercent.toFixed(2)}%`}
                </div>
            )}
        </div>
    );
};

export default ResultsRatio;
