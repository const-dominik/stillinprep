"use client";

import { useState } from "react";
import GetCreateForm from "../repertoire-option/GetCreateForm";

import { WindowElement } from "@/components/utils/Utils";
import { DbRepertoires } from "@/lib/types/backend-types";
import ListElement from "./ListElement";
import styles from "./styles.module.scss";

const SharedList = ({
    sharedRepertoires,
}: {
    sharedRepertoires: DbRepertoires["shared"];
}) => {
    const [search, setSearch] = useState("");

    const filteredRepertoires = sharedRepertoires.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <WindowElement title="Repertoires shared with you">
            <GetCreateForm
                search={search}
                setSearch={setSearch}
                hasRepertoires={sharedRepertoires.length > 0}
                noAdd={true}
            />
            {!sharedRepertoires.length && (
                <p className={styles["no-repertoires"]}>
                    Nobody shared a repertoire with you.
                </p>
            )}
            {filteredRepertoires.map((repertoire) => (
                <ListElement
                    name={repertoire.name}
                    owner={repertoire.owner.nickname}
                    accessMode={repertoire.accessMode}
                    id={repertoire.id}
                    key={repertoire.id}
                />
            ))}
        </WindowElement>
    );
};

export default SharedList;
