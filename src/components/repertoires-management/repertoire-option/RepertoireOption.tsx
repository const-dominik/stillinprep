import { MouseEvent } from "react";
import { CiSettings } from "react-icons/ci";

import Link from "next/link";
import styles from "./styles/RepertoireViewMode.module.scss";

const RepertoireOption = ({
    name,
    id,
    setEditedSettingsId,
    creatingRepertoire,
}: {
    name: string;
    id: string;
    setEditedSettingsId: (id: string) => void;
    creatingRepertoire: string;
}) => {
    const handleSettingsClick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!creatingRepertoire) {
            setEditedSettingsId(id);
        }
    };

    const handleLinkClick = (e: MouseEvent) => {
        if (creatingRepertoire) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const classes = [styles["repertoire-element"]];
    if (creatingRepertoire) {
        classes.push(styles["cursor-disabled"]);
    }

    return (
        <Link
            href={`/repertoire/${id}`}
            className={styles["link"]}
            prefetch={true}
            onClick={handleLinkClick}
        >
            <div className={classes.join(" ")}>
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
