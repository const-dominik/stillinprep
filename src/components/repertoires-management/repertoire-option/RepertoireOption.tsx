import { Dispatch, SetStateAction } from "react";
import RepertoireEditMode from "../forms/RepertoireEditMode";
import RepertoireViewMode from "./RepertoireViewMode";
import useRepertoireEdit from "./logic/useRepertoireEdit";

const RepertoireOption = ({
    id,
    name,
    setRemovedRepertoires,
}: {
    id: string;
    name: string;
    setRemovedRepertoires: Dispatch<SetStateAction<string[]>>;
}) => {
    const handleRemove = (removedId: string) => {
        setRemovedRepertoires((prev) => [...prev, removedId]);
    };

    const {
        isEditing,
        newName,
        currentName,
        setCurrentName,
        toggleEdit,
        saveName,
        remove,
        hasChanges,
    } = useRepertoireEdit(id, name, handleRemove);

    if (isEditing) {
        return (
            <RepertoireEditMode
                currentName={currentName}
                setCurrentName={setCurrentName}
                onSave={saveName}
                onRemove={remove}
                onCancel={toggleEdit}
                hasChanges={hasChanges}
            />
        );
    }

    return <RepertoireViewMode name={newName} id={id} onEdit={toggleEdit} />;
};

export default RepertoireOption;
