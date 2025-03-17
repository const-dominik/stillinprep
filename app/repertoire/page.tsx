import Chessboard from "../_components/chessboard/Chessboard";
import styles from "./page.module.css";

const Content = () => {
    return (
        <div className={styles.container}>
            <Chessboard />
        </div>
    );
};

export default Content;
