import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { CiSettings } from "react-icons/ci";

import styles from "./styles/RepertoireViewMode.module.scss";

const RepertoireOption = ({
    name,
    id,
    setEditedSettingsId,
}: {
    name: string;
    id: string;
    setEditedSettingsId: (id: string) => void;
}) => {
    const router = useRouter();
    const handleSettingsClick = (e: MouseEvent) => {
        e.stopPropagation();
        setEditedSettingsId(id);
    };

    const handleRepertoireClick = () => {
        router.push(`repertoire/${id}`);
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

export default RepertoireOption;
