import { VscLoading } from "react-icons/vsc";
import styles from "./styles/RepertoireViewMode.module.scss";

const RepertoireOption = ({ name }: { name: string }) => {
    return (
        <div className={styles["repertoire-element"]}>
            {name}
            <div className={styles["spinning-icon"]}>
                <VscLoading />
            </div>
        </div>
    );
};

export default RepertoireOption;
