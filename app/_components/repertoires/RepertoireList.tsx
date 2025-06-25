"use client";

import type { Repertoire } from "../../types/types";
import styles from "./styles.module.scss";
import AddRepertoire from "./AddRepertoire";
import { useState } from "react";
import Search from "./Search";
import RepertoireOption from "./RepertoireOption";
import { ConfirmProvider } from "@/app/context/ConfirmContext";

const RepertoireList = ({ repertoires }: { repertoires: Repertoire[] }) => {
    const [search, setSearch] = useState("");
    const [removedRepertoires, setRemovedRepertoires] = useState<string[]>([]);

    return (
        <ConfirmProvider>
            <div className={styles.container}>
                <div className={styles["repertoires-list"]}>
                    <AddRepertoire />
                    {repertoires.length && (
                        <Search search={search} setSearch={setSearch} />
                    )}
                    {!repertoires.length && (
                        <p className={styles["no-repertoires"]}>
                            You don&apos;t have any repertoires.
                        </p>
                    )}
                    {repertoires
                        .filter(
                            ({ name, id }) =>
                                name
                                    .toLowerCase()
                                    .includes(search.toLowerCase()) &&
                                !removedRepertoires.includes(id)
                        )
                        .map(({ id, name }) => (
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
