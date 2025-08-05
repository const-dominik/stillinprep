"use client";

import { WindowElement } from "@/components/utils/Utils";
import { DbRepertoires } from "@/lib/types/backend-types";
import { useState } from "react";
import GetCreateForm from "../repertoire-option/GetCreateForm";
import RepertoireEditMode from "../repertoire-option/RepertoireEditMode";
import RepertoireOption from "../repertoire-option/RepertoireOption";
import styles from "./styles.module.scss";

const OwnedList = ({
    ownedRepertoires,
}: {
    ownedRepertoires: DbRepertoires["owned"];
}) => {
    const [search, setSearch] = useState("");
    const [editedSettingsId, setEditedSettingsId] = useState("");

    const filteredRepertoires = ownedRepertoires.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {!editedSettingsId && (
                <WindowElement>
                    <GetCreateForm
                        search={search}
                        setSearch={setSearch}
                        hasRepertoires={ownedRepertoires.length > 0}
                    />
                    {!ownedRepertoires.length && (
                        <p className={styles["no-repertoires"]}>
                            You don&apos;t have any repertoires.
                        </p>
                    )}
                    {filteredRepertoires.map(({ id, name }) => (
                        <RepertoireOption
                            id={id}
                            name={name}
                            setEditedSettingsId={setEditedSettingsId}
                            key={id}
                        />
                    ))}
                </WindowElement>
            )}
            {editedSettingsId && (
                <RepertoireEditMode
                    editedSettingsData={
                        ownedRepertoires.find(
                            (repertoire) => repertoire.id === editedSettingsId
                        )!
                    }
                    setEditedSettingsId={setEditedSettingsId}
                />
            )}
        </>
    );
};

export default OwnedList;
