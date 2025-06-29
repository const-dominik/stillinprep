import { redirect } from "next/navigation";
import { MouseEvent } from "react";
import { CiSettings } from "react-icons/ci";

import styles from "./styles/RepertoireViewMode.module.scss";

const RepertoireViewMode = ({
    name,
    id,
    onEdit,
}: {
    name: string;
    id: string;
    onEdit: () => void;
}) => {
    const handleSettingsClick = (e: MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    const handleRepertoireClick = () => {
        redirect(`repertoire/${id}`);
    };

    return (
        <div
            onClick={handleRepertoireClick}
            className={styles["repertoire-element"]}
        >
            {name}
            <div className={styles["repertoire-settings"]}>
                <CiSettings
                    onClick={handleSettingsClick}
                    data-testid="settings"
                />
            </div>
        </div>
    );
};

export default RepertoireViewMode;
