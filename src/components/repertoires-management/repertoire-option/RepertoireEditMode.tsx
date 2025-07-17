"use client";

import { UseFormInput, WindowElement } from "@/components/utils/Utils";
import { changeRepertoireSettings } from "@/lib/actions/repertoire";
import { Repertoire, RepertoireEditData } from "@/lib/types/types";
import styles from "@/styles/formStyling.module.scss";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    RemoveButton,
    UseFormSelect,
    UserAccessFields,
} from "./RepertoireEditFields";

const RepertoireEditMode = ({
    editedSettingsData,
    setEditedSettingsId,
}: {
    editedSettingsData: Repertoire;
    setEditedSettingsId: (id: string) => void;
}) => {
    const { id, name, visibility, hasAccess } = editedSettingsData;
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<RepertoireEditData>({
        mode: "onChange",
        defaultValues: {
            name,
            visibility,
        },
    });

    const onSubmit = async (data: RepertoireEditData) => {
        const result = await changeRepertoireSettings(data, id);

        if (result.success) {
            router.refresh();

            setEditedSettingsId("");
        }
    };

    return (
        <WindowElement>
            <p className={styles.title}>Repertoire Settings</p>

            <form className={styles.form}>
                <UseFormInput
                    label={"Name"}
                    settings={register("name", {
                        required: "Repertoire need to have a name.",
                    })}
                    error={errors["name"]}
                />
                <UseFormSelect
                    options={[
                        { label: "private", value: "private" },
                        { label: "public", value: "public" },
                    ]}
                    label="Visibility"
                    control={control}
                    error={errors.visibility}
                />
                <UserAccessFields
                    setValue={setValue}
                    baseAccesses={hasAccess}
                />

                <RemoveButton id={id} />
                <div className={styles.formConfirmation}>
                    <div
                        className={styles.save}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </div>
                    <div
                        className={styles.save}
                        onClick={() => setEditedSettingsId("")}
                    >
                        Cancel
                    </div>
                </div>
            </form>
        </WindowElement>
    );
};

export default RepertoireEditMode;
