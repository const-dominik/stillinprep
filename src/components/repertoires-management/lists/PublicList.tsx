"use client";

import { useState } from "react";
import { WindowElement } from "../../utils/Utils";
import GetCreateForm from "../repertoire-option/GetCreateForm";

import { DbRepertoires } from "@/lib/types/backend-types";
import ListElement from "./ListElement";
import styles from "./styles.module.scss";

const PublicList = ({
    publicRepertoires,
}: {
    publicRepertoires: DbRepertoires["public"];
}) => {
    const [search, setSearch] = useState("");

    const filteredRepertoires = publicRepertoires.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <WindowElement>
            <GetCreateForm
                search={search}
                setSearch={setSearch}
                hasRepertoires={publicRepertoires.length > 0}
                noAdd={true}
            />
            {!publicRepertoires.length && (
                <p className={styles["no-repertoires"]}>
                    There are no public repertoires.
                </p>
            )}
            {filteredRepertoires.map((repertoire) => (
                <ListElement
                    name={repertoire.name}
                    owner={repertoire.owner.nickname}
                    id={repertoire.id}
                    key={repertoire.id}
                />
            ))}
        </WindowElement>
    );
};

export default PublicList;
