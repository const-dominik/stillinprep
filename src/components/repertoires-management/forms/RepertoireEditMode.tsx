import { CiSettings } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

import { MouseEvent } from "react";
import styles from "./styles/RepertoireEditMode.module.scss";

const RepertoireEditMode = ({
    currentName,
    setCurrentName,
    onSave,
    onRemove,
    onCancel,
    hasChanges,
}: {
    currentName: string;
    setCurrentName: (name: string) => void;
    onSave: () => void;
    onRemove: () => void;
    onCancel: () => void;
    hasChanges: boolean;
}) => {
    const handleClick = (e: MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <div className={styles["repertoire-element-edit"]}>
            <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className={styles["repertoire-edit-input"]}
                data-testid="edit-input"
                autoFocus
            />
            {hasChanges && (
                <FaCheck
                    size="1.2rem"
                    onClick={(e) => handleClick(e, onSave)}
                    data-testid="check"
                />
            )}
            <div className={styles["repertoire-settings"]}>
                <FaRegTrashCan
                    size="1.3rem"
                    onClick={(e) => handleClick(e, onRemove)}
                    data-testid="trashcan"
                />
                <CiSettings
                    onClick={(e) => handleClick(e, onCancel)}
                    data-testid="settings"
                />
            </div>
        </div>
    );
};

export default RepertoireEditMode;
