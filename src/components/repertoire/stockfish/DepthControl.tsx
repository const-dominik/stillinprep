import styles from "./styles/DepthControl.module.scss";

const DepthControl = ({
    setDepth,
    depth,
}: {
    setDepth: (n: number) => void;
    depth: number;
}) => {
    return (
        <div>
            <div className={styles["depth-controls"]}>
                <div>Depth:</div>
                <div
                    className={styles["depth-control-btn"]}
                    onClick={() => setDepth(depth - 1)}
                >
                    -
                </div>
                <div className={styles["depth-display"]}>{depth}</div>
                <div
                    className={styles["depth-control-btn"]}
                    onClick={() => setDepth(depth + 1)}
                >
                    +
                </div>
            </div>
            <div className={styles["depth-info"]}>
                Depth affects engine performance!
            </div>
        </div>
    );
};

export default DepthControl;
