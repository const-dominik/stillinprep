import {
    deleteRepertoire,
    updateRepertoireField,
} from "@/lib/actions/repertoire";
import { useConfirm } from "@/lib/context/confirm/ConfirmContext";
import { useState } from "react";

const useRepertoireEdit = (
    id: string,
    initialName: string,
    onRemove: (id: string) => void
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(initialName);
    const [currentName, setCurrentName] = useState(initialName);
    const confirm = useConfirm();

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const saveName = () => {
        if (newName !== currentName) {
            updateRepertoireField(id, "name", currentName);
            setNewName(currentName);
        }
        setIsEditing(false);
    };

    const remove = async () => {
        const isSure = await confirm(
            "Are you sure? This is irreversible and will remove this repertoire."
        );

        if (isSure) {
            deleteRepertoire(id);
            onRemove(id);
        }
    };

    return {
        isEditing,
        newName,
        toggleEdit,
        saveName,
        setCurrentName,
        currentName,
        remove,
        hasChanges: newName !== currentName,
    };
};

export default useRepertoireEdit;
