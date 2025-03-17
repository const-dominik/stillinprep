import Chessboard from "../_components/chessboard/Chessboard";
import styles from "./page.module.css";

export default () => {
    return (
        <div className={styles.container}>
            <Chessboard />
        </div>
    );
};
