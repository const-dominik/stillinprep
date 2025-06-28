"use client";

import { redirect } from "next/navigation";
import styles from "./styles.module.scss";
import { CiSettings } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import {
    deleteRepertoire,
    updateRepertoireField,
} from "@/app/actions/repertoire";
import { useConfirm } from "@/app/context/ConfirmContext";

const RepertoireOption = ({
    id,
    name,
    setRemovedRepertoires,
}: {
    id: string;
    name: string;
    setRemovedRepertoires: Dispatch<SetStateAction<string[]>>;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const confirm = useConfirm();

    const handleSettingsClick = (e: MouseEvent) => {
        e.stopPropagation();

        setIsEditing((prev) => !prev);
    };

    const saveNewName = (e: MouseEvent) => {
        e.stopPropagation();

        updateRepertoireField(id, "name", newName);

        setIsEditing(false);
    };

    const removeRepertoire = async (e: MouseEvent) => {
        e.stopPropagation();

        const isSure = await confirm(
            "Are you sure? This is irreversible and will remove this repertoire."
        );

        if (isSure) {
            deleteRepertoire(id);
            setRemovedRepertoires((prev) => [...prev, id]);
        }
    };

    if (isEditing) {
        return (
            <div className={styles["repertoire-element-edit"]}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={styles["repertoire-edit-input"]}
                    data-testid="edit-input"
                />
                {newName !== name && (
                    <FaCheck
                        size={"1.2rem"}
                        onClick={saveNewName}
                        data-testid="check"
                    />
                )}
                <div className={styles["repertoire-settings"]}>
                    <FaRegTrashCan
                        size="1.3rem"
                        onClick={removeRepertoire}
                        data-testid="trashcan"
                    />
                    <CiSettings
                        onClick={handleSettingsClick}
                        data-testid="settings"
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => {
                redirect(`repertoire/${id}`);
            }}
            className={styles["repertoire-element"]}
        >
            {newName}
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
