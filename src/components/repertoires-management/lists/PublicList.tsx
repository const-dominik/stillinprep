"use client";

import { useState } from "react";
import { WindowElement } from "../../utils/Utils";
import GetCreateForm from "../repertoire-option/GetCreateForm";

import { DbRepertoires } from "@/lib/types/backend-types";
import { type User } from "next-auth";
import ListElement from "./ListElement";
import styles from "./styles.module.scss";

const PublicList = ({
    publicRepertoires,
    user,
}: {
    publicRepertoires: DbRepertoires["public"];
    user: User;
}) => {
    const [search, setSearch] = useState("");

    const filteredRepertoires = publicRepertoires.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <WindowElement title="Public repertoires">
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
                    isPublic={
                        true && user?.nickname !== repertoire.owner.nickname
                    }
                />
            ))}
        </WindowElement>
    );
};

export default PublicList;
