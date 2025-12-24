"use client";

import { WindowElement } from "@/components/utils/component/Utils";
import {
    DbPublicRepertoires,
    DbSharedRepertoires,
} from "@/lib/types/backend-types";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";
import FilterForm from "./ui/FilterForm";
import ListElement from "./ui/ListElement";

const RepertoiresListWrapper = ({
    repertoires,
    title,
    emptyMessage,
}: {
    repertoires: DbPublicRepertoires | DbSharedRepertoires;
    title: string;
    emptyMessage: string;
}) => {
    const [search, setSearch] = useState("");

    const filteredRepertoires = useMemo(
        () =>
            repertoires.filter((repertoire) =>
                repertoire.name.toLowerCase().includes(search.toLowerCase())
            ),
        [repertoires, search]
    );

    if (!repertoires.length) {
        return (
            <WindowElement title={title}>
                <p className={styles["no-repertoires"]}>{emptyMessage}</p>
            </WindowElement>
        );
    }

    return (
        <WindowElement title={title}>
            <FilterForm search={search} setSearch={setSearch} />
            {filteredRepertoires.map((repertoire) => (
                <ListElement
                    name={repertoire.name}
                    owner={repertoire.owner.nickname}
                    id={repertoire.id}
                    key={repertoire.id}
                    accessMode={
                        "accessMode" in repertoire
                            ? repertoire.accessMode
                            : undefined
                    }
                />
            ))}
        </WindowElement>
    );
};

export default RepertoiresListWrapper;
