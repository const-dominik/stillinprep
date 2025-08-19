"use client";

import { UseFormInput, WindowElement } from "@/components/utils/Utils";
import { changeRepertoireSettings } from "@/lib/actions/repertoire";
import { Repertoire, RepertoireEditData } from "@/lib/types/types";
import styles from "@/styles/formStyling.module.scss";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import {
    RemoveButton,
    RepertoireColor,
    UseFormSelect,
    UserAccessFields,
} from "./RepertoireEditFields";
import customStyles from "./styles/RepertoireEditMode.module.scss";

const RepertoireEditMode = ({
    editedSettingsData,
    setEditedSettingsId,
    setRemovedRepertoires,
    nickname,
}: {
    editedSettingsData: Repertoire;
    setEditedSettingsId: Dispatch<SetStateAction<string>>;
    setRemovedRepertoires: Dispatch<SetStateAction<string[]>>;
    nickname: string;
}) => {
    const { id, name, visibility, hasAccess, color } = editedSettingsData;
    const router = useRouter();
    const [isCheckingUser, setIsCheckingUser] = useState(false);
    const [userError, setUserError] = useState<string>("");

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
            color,
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
            {userError && <p className={styles.error}>{userError}</p>}
            {isCheckingUser && (
                <p className={styles.awaiting}>Checking user existance...</p>
            )}
            <form className={styles.form}>
                <div className={customStyles["short-field"]}>
                    <UseFormInput
                        label={"Name"}
                        settings={register("name", {
                            required: "Repertoire need to have a name.",
                        })}
                        error={errors["name"]}
                    />
                    <div className={customStyles["icon-container"]}>
                        <RepertoireColor color={color} setValue={setValue} />
                    </div>
                </div>
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
                    setIsCheckingUser={setIsCheckingUser}
                    setUserError={setUserError}
                    nickname={nickname}
                />

                <RemoveButton
                    id={id}
                    setEditedSettingsId={setEditedSettingsId}
                    setRemovedRepertoires={setRemovedRepertoires}
                />
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
