"use client";

import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import type { Repertoire } from "@/lib/types/types";
import { useState } from "react";
import GetCreateForm from "./forms/GetCreateForm";
import RepertoireOption from "./repertoire-option/RepertoireOption";
import styles from "./RepertoireList.module.scss";

const RepertoireList = ({ repertoires }: { repertoires: Repertoire[] }) => {
    const [search, setSearch] = useState("");
    const [removedRepertoires, setRemovedRepertoires] = useState<string[]>([]);

    const filteredRepertoires = repertoires.filter(
        ({ name, id }) =>
            name.toLowerCase().includes(search.toLowerCase()) &&
            !removedRepertoires.includes(id)
    );

    return (
        <ConfirmProvider>
            <div className={styles["container"]}>
                <div className={styles["repertoires-list"]}>
                    <GetCreateForm search={search} setSearch={setSearch} />
                    {!repertoires.length && (
                        <p className={styles["no-repertoires"]}>
                            You don&apos;t have any repertoires.
                        </p>
                    )}
                    {filteredRepertoires.map(({ id, name }) => (
                        <RepertoireOption
                            id={id}
                            name={name}
                            key={id}
                            setRemovedRepertoires={setRemovedRepertoires}
                        />
                    ))}
                </div>
            </div>
        </ConfirmProvider>
    );
};

export default RepertoireList;
