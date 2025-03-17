import Chessboard from "../_components/Chessboard";
import styles from "./page.module.css";

export default () => {
    return (
        <div className={styles.container}>
            <Chessboard />
        </div>
    );
};
