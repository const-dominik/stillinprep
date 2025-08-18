import { MouseEvent } from "react";
import { CiSettings } from "react-icons/ci";

import Link from "next/link";
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
    const handleSettingsClick = (e: MouseEvent) => {
        e.stopPropagation();
        setEditedSettingsId(id);
    };

    return (
        <Link
            href={`/repertoire/${id}`}
            className={styles["link"]}
            prefetch={true}
        >
            <div className={styles["repertoire-element"]}>
                {name}
                <div className={styles["repertoire-settings"]}>
                    <CiSettings
                        onClick={handleSettingsClick}
                        data-testid="settings"
                    />
                </div>
            </div>
        </Link>
    );
};

export default RepertoireOption;
