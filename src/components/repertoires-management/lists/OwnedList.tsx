"use client";

import { WindowElement } from "@/components/utils/component/Utils";
import { DbRepertoires } from "@/lib/types/backend-types";
import { type User } from "next-auth";
import { useState } from "react";
import FakeRepertoireOption from "../repertoire-option/FakeRepertoireOption";
import RepertoireEditMode from "../repertoire-option/RepertoireEditMode";
import RepertoireOption from "../repertoire-option/RepertoireOption";
import styles from "./styles.module.scss";
import CreateForm from "./ui/CreateForm";
import FilterForm from "./ui/FilterForm";

const OwnedList = ({
    ownedRepertoires,
    user,
}: {
    ownedRepertoires: DbRepertoires["owned"];
    user: User;
}) => {
    const [search, setSearch] = useState("");
    const [editedSettingsId, setEditedSettingsId] = useState("");
    const [removedRepertoires, setRemovedRepertoires] = useState<string[]>([]);
    const [creatingRepertoire, setCreatingRepertoire] = useState("");

    const filteredRepertoires = ownedRepertoires.filter(
        ({ name, id }) =>
            name.toLowerCase().includes(search.toLowerCase()) &&
            !removedRepertoires.includes(id)
    );

    const hasRepertoires =
        ownedRepertoires.length - removedRepertoires.length > 0;

    return (
        <>
            {!editedSettingsId && (
                <WindowElement title="Your repertoires">
                    <CreateForm setCreatingRepertoire={setCreatingRepertoire} />
                    <FilterForm search={search} setSearch={setSearch} />
                    {!hasRepertoires && (
                        <p className={styles["no-repertoires"]}>
                            Create your first repertoire above.
                        </p>
                    )}
                    {creatingRepertoire && (
                        <FakeRepertoireOption name={creatingRepertoire} />
                    )}
                    {filteredRepertoires.map(({ id, name }) => (
                        <RepertoireOption
                            id={id}
                            name={name}
                            setEditedSettingsId={setEditedSettingsId}
                            creatingRepertoire={creatingRepertoire}
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
                    setRemovedRepertoires={setRemovedRepertoires}
                    nickname={user.nickname!}
                />
            )}
        </>
    );
};

export default OwnedList;
